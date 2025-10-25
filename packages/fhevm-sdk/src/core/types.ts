import type { Eip1193Provider } from "ethers";

/**
 * FHEVM client configuration
 */
export interface FhevmConfig {
  /** EIP-1193 provider or RPC URL */
  provider: string | Eip1193Provider;
  
  /** Chain ID (optional, will be detected from provider) */
  chainId?: number;
  
  /** 
   * Mock chain configurations for local testing (chainId -> RPC URL)
   * Note: This is passed through but not used by the core SDK.
   * It's available for framework-specific implementations.
   */
  mockChains?: Record<number, string>;
  
  /** Abort signal for cancellation */
  signal?: AbortSignal;
  
  /** Status change callback for tracking initialization progress */
  onStatusChange?: (status: FhevmStatus) => void;
}

/**
 * FHEVM client status during initialization
 */
export type FhevmStatus = 
  | "idle"
  | "sdk-loading"
  | "sdk-loaded"
  | "sdk-initializing"
  | "sdk-initialized"
  | "creating"
  | "ready"
  | "error";

/**
 * Encrypted input result from encryption operations
 */
export interface EncryptedInput {
  /** Encrypted handles for each input */
  handles: Uint8Array[];
  /** Input proof for verification */
  inputProof: Uint8Array;
}

/**
 * Request for decrypting an encrypted handle
 */
export interface DecryptRequest {
  /** The encrypted handle to decrypt */
  handle: string;
  /** Contract address that owns the handle */
  contractAddress: `0x${string}`;
}

/**
 * Result of decryption operations
 * Maps handle to decrypted value
 */
export interface DecryptResult {
  [handle: string]: string | bigint | boolean;
}

/**
 * FHEVM encrypted type
 */
export type FhevmType = 
  | "bool"
  | "uint8"
  | "uint16"
  | "uint32"
  | "uint64"
  | "uint128"
  | "uint256"
  | "address";
