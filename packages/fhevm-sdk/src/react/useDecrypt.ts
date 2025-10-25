import { useCallback, useState } from "react";
import type { FhevmClient } from "../core/client.js";
import type { DecryptRequest, DecryptResult } from "../core/types.js";
import type { JsonRpcSigner } from "ethers";

/**
 * React hook for decrypting FHEVM values
 * 
 * Provides both user decryption (with EIP-712 signature) and public decryption.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client } = useFhevmClient({ ... });
 *   const { userDecrypt, publicDecrypt, isDecrypting, results } = useDecrypt({
 *     client,
 *     signer
 *   });
 *   
 *   const handleDecrypt = async () => {
 *     const result = await userDecrypt([
 *       { handle: '0x...', contractAddress: '0x...' }
 *     ]);
 *     console.log('Decrypted:', result);
 *   };
 * }
 * ```
 */
export function useDecrypt(parameters: {
  /** FHEVM client instance */
  client: FhevmClient | undefined;
  /** Ethers signer for EIP-712 signing */
  signer?: JsonRpcSigner;
}): {
  /** Decrypt with user signature (EIP-712) */
  userDecrypt: (requests: DecryptRequest[]) => Promise<DecryptResult>;
  /** Decrypt public values (no signature) */
  publicDecrypt: (handles: string[]) => Promise<DecryptResult>;
  /** Whether decryption is in progress */
  isDecrypting: boolean;
  /** Last decryption results */
  results: DecryptResult | undefined;
  /** Clear results */
  clearResults: () => void;
} {
  const { client, signer } = parameters;

  const [isDecrypting, setIsDecrypting] = useState(false);
  const [results, setResults] = useState<DecryptResult | undefined>(undefined);

  const userDecrypt = useCallback(
    async (requests: DecryptRequest[]): Promise<DecryptResult> => {
      if (!client) {
        throw new Error("Cannot decrypt: client not ready");
      }
      if (!signer) {
        throw new Error("Cannot decrypt: signer not provided");
      }

      setIsDecrypting(true);
      try {
        const result = await client.userDecrypt(requests, signer);
        setResults(result);
        return result;
      } catch (error) {
        // Re-throw the error so the caller can handle it
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, signer]
  );

  const publicDecrypt = useCallback(
    async (handles: string[]): Promise<DecryptResult> => {
      if (!client) {
        throw new Error("Cannot decrypt: client not ready");
      }

      setIsDecrypting(true);
      try {
        const result = await client.publicDecrypt(handles);
        setResults(result);
        return result;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  const clearResults = useCallback(() => {
    setResults(undefined);
  }, []);

  return {
    userDecrypt,
    publicDecrypt,
    isDecrypting,
    results,
    clearResults,
  };
}
