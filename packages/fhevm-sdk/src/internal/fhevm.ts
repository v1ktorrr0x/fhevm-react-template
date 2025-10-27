import { isAddress, Eip1193Provider, JsonRpcProvider } from "ethers";
import type {
  FhevmInitSDKOptions,
  FhevmInitSDKType,
  FhevmLoadSDKType,
  FhevmWindowType,
} from "./fhevmTypes.js";
import { isFhevmWindowType, RelayerSDKLoader } from "./RelayerSDKLoader.js";
import { publicKeyStorageGet, publicKeyStorageSet } from "./PublicKeyStorage.js";
import { FhevmInstance, FhevmInstanceConfig } from "../fhevmTypes.js";

export class FhevmReactError extends Error {
  code: string;
  constructor(code: string, message?: string, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.name = "FhevmReactError";
  }
}

function throwFhevmError(
  code: string,
  message?: string,
  cause?: unknown
): never {
  throw new FhevmReactError(code, message, cause ? { cause } : undefined);
}

const isFhevmInitialized = (): boolean => {
  // Don't pass trace function in test environment to reduce noise
  const trace = process.env.NODE_ENV === 'test' ? undefined : console.log;
  if (!isFhevmWindowType(window, trace)) {
    return false;
  }
  return window.relayerSDK.__initialized__ === true;
};

const fhevmLoadSDK: FhevmLoadSDKType = () => {
  const loader = new RelayerSDKLoader({ trace: console.log });
  return loader.load();
};

const fhevmInitSDK: FhevmInitSDKType = async (
  options?: FhevmInitSDKOptions
) => {
  const trace = process.env.NODE_ENV === 'test' ? undefined : console.log;
  if (!isFhevmWindowType(window, trace)) {
    throw new Error("window.relayerSDK is not available");
  }
  const result = await window.relayerSDK.initSDK(options);
  window.relayerSDK.__initialized__ = result;
  if (!result) {
    throw new Error("window.relayerSDK.initSDK failed.");
  }
  return true;
};

function checkIsAddress(a: unknown): a is `0x${string}` {
  if (typeof a !== "string") {
    return false;
  }
  if (!isAddress(a)) {
    return false;
  }
  return true;
}

export class FhevmAbortError extends Error {
  constructor(message = "FHEVM operation was cancelled") {
    super(message);
    this.name = "FhevmAbortError";
  }
}

type FhevmRelayerStatusType =
  | "sdk-loading"
  | "sdk-loaded"
  | "sdk-initializing"
  | "sdk-initialized"
  | "creating";

async function getChainId(
  providerOrUrl: Eip1193Provider | string
): Promise<number> {
  if (typeof providerOrUrl === "string") {
    const provider = new JsonRpcProvider(providerOrUrl);
    return Number((await provider.getNetwork()).chainId);
  }
  const chainId = await providerOrUrl.request({ method: "eth_chainId" });
  return Number.parseInt(chainId as string, 16);
}

async function getWeb3Client(rpcUrl: string) {
  const rpc = new JsonRpcProvider(rpcUrl);
  try {
    const version = await rpc.send("web3_clientVersion", []);
    return version;
  } catch (e) {
    throwFhevmError(
      "WEB3_CLIENTVERSION_ERROR",
      `The URL ${rpcUrl} is not a Web3 node or is not reachable. Please check the endpoint.`,
      e
    );
  } finally {
    rpc.destroy();
  }
}

async function tryFetchFHEVMHardhatNodeRelayerMetadata(rpcUrl: string): Promise<
  | {
    ACLAddress: `0x${string}`;
    InputVerifierAddress: `0x${string}`;
    KMSVerifierAddress: `0x${string}`;
  }
  | undefined
> {
  const version = await getWeb3Client(rpcUrl);
  if (
    typeof version !== "string" ||
    !version.toLowerCase().includes("hardhat")
  ) {
    // Not a Hardhat Node
    return undefined;
  }
  try {
    const metadata = await getFHEVMRelayerMetadata(rpcUrl);
    if (!metadata || typeof metadata !== "object") {
      return undefined;
    }
    if (
      !(
        "ACLAddress" in metadata &&
        typeof metadata.ACLAddress === "string" &&
        metadata.ACLAddress.startsWith("0x")
      )
    ) {
      return undefined;
    }
    if (
      !(
        "InputVerifierAddress" in metadata &&
        typeof metadata.InputVerifierAddress === "string" &&
        metadata.InputVerifierAddress.startsWith("0x")
      )
    ) {
      return undefined;
    }
    if (
      !(
        "KMSVerifierAddress" in metadata &&
        typeof metadata.KMSVerifierAddress === "string" &&
        metadata.KMSVerifierAddress.startsWith("0x")
      )
    ) {
      return undefined;
    }
    return metadata;
  } catch {
    // Not a FHEVM Hardhat Node
    return undefined;
  }
}

async function getFHEVMRelayerMetadata(rpcUrl: string) {
  const rpc = new JsonRpcProvider(rpcUrl);
  try {
    const version = await rpc.send("fhevm_relayer_metadata", []);
    return version;
  } catch (e) {
    throwFhevmError(
      "FHEVM_RELAYER_METADATA_ERROR",
      `The URL ${rpcUrl} is not a FHEVM Hardhat node or is not reachable. Please check the endpoint.`,
      e
    );
  } finally {
    rpc.destroy();
  }
}

async function resolve(
  providerOrUrl: Eip1193Provider | string
): Promise<{ chainId: number; rpcUrl?: string }> {
  // Try to get chainId from provider property first (wagmi/viem style)
  if (providerOrUrl && typeof providerOrUrl === 'object' && 'chainId' in providerOrUrl) {
    const chainId = Number((providerOrUrl as any).chainId);
    if (!isNaN(chainId)) {
      console.log("[FHEVM SDK] Got chainId from provider property:", chainId);
      return { chainId, rpcUrl: undefined };
    }
  }

  // Fallback to calling eth_chainId
  const chainId = await getChainId(providerOrUrl);

  // Resolve rpc url
  const rpcUrl = typeof providerOrUrl === "string" ? providerOrUrl : undefined;

  return { chainId, rpcUrl };
}

export const createFhevmInstance = async (parameters: {
  provider: Eip1193Provider | string;
  chainId?: number;
  mockChains?: Record<number, string>;
  signal: AbortSignal;
  onStatusChange?: (status: FhevmRelayerStatusType) => void;
}): Promise<FhevmInstance> => {
  // Debug logging (can be disabled in production)
  if (process.env.NODE_ENV !== 'test') {
    console.log('[FHEVM SDK] createFhevmInstance called with:', {
      hasProvider: !!parameters.provider,
      providerType: typeof parameters.provider,
      chainIdProvided: parameters.chainId,
    });
  }

  const throwIfAborted = () => {
    if (signal.aborted) throw new FhevmAbortError();
  };

  const notify = (status: FhevmRelayerStatusType) => {
    if (onStatusChange) onStatusChange(status);
  };

  const {
    signal,
    onStatusChange,
    provider: providerOrUrl,
    chainId: providedChainId,
    mockChains,
  } = parameters;

  // Resolve chainId and rpcUrl
  let rpcUrl: string | undefined;
  let chainId: number;

  // Use provided chainId if available, otherwise resolve from provider
  if (providedChainId !== undefined) {
    chainId = providedChainId;
    // Check if we have a mock RPC URL for this chainId
    if (mockChains && mockChains[chainId]) {
      rpcUrl = mockChains[chainId];
    }
    if (process.env.NODE_ENV !== 'test') {
      console.log('[FHEVM SDK] Using provided chainId:', { chainId, rpcUrl });
    }
  } else {
    try {
      const resolved = await resolve(providerOrUrl);
      rpcUrl = resolved.rpcUrl;
      chainId = resolved.chainId;
      if (process.env.NODE_ENV !== 'test') {
        console.log('[FHEVM SDK] Resolved from provider:', { chainId, rpcUrl });
      }
    } catch (error) {
      console.error('[FHEVM SDK] Error resolving provider:', error);
      throw error;
    }
  }

  throwIfAborted();

  // Check if this is a Hardhat node with FHEVM support (localhost mock)
  if (rpcUrl && chainId === 31337) {
    if (process.env.NODE_ENV !== 'test') {
      console.log('[FHEVM SDK] Detected localhost (chainId 31337), checking for FHEVM Hardhat node...');
      console.log('[FHEVM SDK] RPC URL:', rpcUrl);
    }

    try {
      const hardhatMetadata = await tryFetchFHEVMHardhatNodeRelayerMetadata(rpcUrl);
      if (process.env.NODE_ENV !== 'test') {
        console.log('[FHEVM SDK] Hardhat metadata result:', hardhatMetadata);
      }

      if (hardhatMetadata) {
        // fhevmRelayerMetadata is defined, which means rpcUrl refers to a FHEVM Hardhat Node
        if (process.env.NODE_ENV !== 'test') {
          console.log('[FHEVM SDK] ✅ Detected FHEVM Hardhat node, using real mock implementation');
          console.log('[FHEVM SDK] ACL Address:', hardhatMetadata.ACLAddress);
        }

        notify("creating");

        //////////////////////////////////////////////////////////////////////////
        // 
        // WARNING!!
        // ALWAYS USE DYNAMIC IMPORT TO AVOID INCLUDING THE ENTIRE FHEVM MOCK LIB 
        // IN THE FINAL PRODUCTION BUNDLE!!
        // 
        //////////////////////////////////////////////////////////////////////////
        const fhevmMock = await import("./mock/fhevmMock.js");
        const mockInstance = await fhevmMock.fhevmMockCreateInstance({
          rpcUrl,
          chainId: Number(chainId),
          metadata: hardhatMetadata,
        });

        throwIfAborted();

        if (process.env.NODE_ENV !== 'test') {
          console.log('[FHEVM SDK] ✅ Real mock instance created successfully');
        }
        return mockInstance;
      } else {
        if (process.env.NODE_ENV !== 'test') {
          console.log('[FHEVM SDK] ⚠️ Not a FHEVM Hardhat node (metadata check failed)');
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[FHEVM SDK] ❌ Error checking for FHEVM Hardhat node:', error);
      }
    }
  }

  if (process.env.NODE_ENV !== 'test') {
    console.log('[FHEVM SDK] Using standard Relayer SDK for chainId:', chainId);
  }

  // Not a mock - use real Relayer SDK for Sepolia or other networks
  const trace = process.env.NODE_ENV === 'test' ? undefined : console.log;
  if (!isFhevmWindowType(window, trace)) {
    notify("sdk-loading");

    // throws an error if failed
    await fhevmLoadSDK();
    throwIfAborted();

    notify("sdk-loaded");
  }

  // notify that state === "sdk-loaded"

  if (!isFhevmInitialized()) {
    notify("sdk-initializing");

    // throws an error if failed
    await fhevmInitSDK();
    throwIfAborted();

    notify("sdk-initialized");
  }

  const relayerSDK = (window as unknown as FhevmWindowType).relayerSDK;

  const aclAddress = relayerSDK.SepoliaConfig.aclContractAddress;
  if (!checkIsAddress(aclAddress)) {
    throw new Error(`Invalid address: ${aclAddress}`);
  }

  const pub = await publicKeyStorageGet(aclAddress);
  throwIfAborted();

  // Use the injected wallet provider directly for network configuration
  // This automatically uses the connected wallet's network (e.g. Sepolia)
  // and avoids any RPC configuration or Infura issues
  const config: FhevmInstanceConfig = {
    ...relayerSDK.SepoliaConfig,
    network: typeof providerOrUrl === 'string' ? providerOrUrl : providerOrUrl, // Use wallet provider as-is
    publicKey: pub.publicKey,
    publicParams: pub.publicParams,
  };

  // notify that state === "creating"
  notify("creating");

  const instance = await relayerSDK.createInstance(config);

  // Save the key even if aborted
  await publicKeyStorageSet(
    aclAddress,
    instance.getPublicKey(),
    instance.getPublicParams(2048)
  );

  throwIfAborted();

  return instance;
};
