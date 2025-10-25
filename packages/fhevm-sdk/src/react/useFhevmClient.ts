import { useCallback, useEffect, useRef, useState } from "react";
import { FhevmClient } from "../core/client.js";
import type { FhevmStatus } from "../core/types.js";
import type { Eip1193Provider } from "ethers";

/**
 * React hook for managing FHEVM client lifecycle
 * 
 * This is the new wagmi-like API for FHEVM. It uses the framework-agnostic
 * FhevmClient under the hood.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, status, error } = useFhevmClient({
 *     provider: window.ethereum,
 *     chainId: 11155111
 *   });
 *   
 *   if (status === 'loading') return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!client) return null;
 *   
 *   // Use client for encryption/decryption
 * }
 * ```
 */
export function useFhevmClient(parameters: {
  /** EIP-1193 provider or RPC URL */
  provider: string | Eip1193Provider | undefined;
  /** Chain ID (optional, will be detected) */
  chainId?: number;
  /** Mock chain configurations for local testing (chainId -> RPC URL) */
  mockChains?: Record<number, string>;
  /** Enable/disable the hook */
  enabled?: boolean;
}): {
  /** FHEVM client instance (undefined until ready) */
  client: FhevmClient | undefined;
  /** Current status */
  status: FhevmStatus;
  /** Error if initialization failed */
  error: Error | undefined;
  /** Manually refresh the client */
  refresh: () => void;
} {
  const { provider, chainId, mockChains, enabled = true } = parameters;

  const [client, setClient] = useState<FhevmClient | undefined>(undefined);
  const [status, setStatus] = useState<FhevmStatus>("idle");
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isRunning, setIsRunning] = useState<boolean>(enabled);
  const [providerChanged, setProviderChanged] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const providerRef = useRef<string | Eip1193Provider | undefined>(provider);
  const chainIdRef = useRef<number | undefined>(chainId);
  // mockChains should be stable - only set once to avoid re-initialization loops
  const mockChainsRef = useRef<Record<number, string> | undefined>(mockChains);

  // Initialize mockChainsRef once
  if (mockChainsRef.current === undefined && mockChains !== undefined) {
    mockChainsRef.current = mockChains;
  }

  const refresh = useCallback(() => {
    // Abort any ongoing initialization
    if (abortControllerRef.current) {
      providerRef.current = undefined;
      chainIdRef.current = undefined;

      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Update refs with current values
    providerRef.current = provider;
    chainIdRef.current = chainId;
    mockChainsRef.current = mockChains;

    // Reset state
    setClient(undefined);
    setError(undefined);
    setStatus("idle");

    // Trigger re-initialization if provider is defined
    if (provider !== undefined) {
      setProviderChanged(prev => prev + 1);
    }
  }, [provider, chainId, mockChains]);

  // Sync enabled state
  useEffect(() => {
    setIsRunning(enabled);
  }, [enabled]);

  // Update refs and trigger re-initialization when provider/chainId change
  // Note: mockChains is intentionally excluded to prevent re-initialization loops
  useEffect(() => {
    // Abort any ongoing initialization
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Update refs with new values
    providerRef.current = provider;
    chainIdRef.current = chainId;

    // Reset state
    setClient(undefined);
    setError(undefined);
    setStatus("idle");

    // Trigger re-initialization if provider is defined
    if (provider !== undefined) {
      setProviderChanged(prev => prev + 1);
    }
  }, [provider, chainId]);

  // Main initialization effect - only depends on isRunning and providerChanged
  useEffect(() => {
    // Don't run if disabled
    if (!isRunning) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setClient(undefined);
      setError(undefined);
      setStatus("idle");
      return;
    }

    // Don't run if no provider
    if (providerRef.current === undefined) {
      setClient(undefined);
      setError(undefined);
      setStatus("idle");
      return;
    }

    // Create abort controller if needed
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }

    const signal = abortControllerRef.current.signal;
    const thisProvider = providerRef.current;
    const thisChainId = chainIdRef.current;
    const thisMockChains = mockChainsRef.current;

    // Initialize client
    setStatus("sdk-loading");
    setError(undefined);

    FhevmClient.create({
      provider: thisProvider,
      chainId: thisChainId,
      mockChains: thisMockChains,
      signal: signal,
      onStatusChange: (newStatus) => {
        if (!signal.aborted) {
          setStatus(newStatus);
        }
      },
    })
      .then((newClient) => {
        if (signal.aborted) return;
        if (thisProvider !== providerRef.current) return;

        setClient(newClient);
        setStatus("ready");
      })
      .catch((err) => {
        if (signal.aborted) return;
        if (thisProvider !== providerRef.current) return;

        setError(err);
        setStatus("error");
      });
  }, [isRunning, providerChanged]);

  return { client, status, error, refresh };
}
