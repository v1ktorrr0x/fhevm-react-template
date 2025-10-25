/**
 * Framework-agnostic FHEVM SDK core
 * 
 * This module provides the core FHEVM client that works in any JavaScript environment.
 * Use this directly in Node.js, or use the React hooks in `@fhevm-sdk/react`.
 * 
 * @example
 * ```typescript
 * import { FhevmClient } from '@fhevm-sdk/core';
 * 
 * const client = await FhevmClient.create({
 *   provider: 'http://localhost:8545',
 *   chainId: 31337
 * });
 * 
 * const encrypted = await client.encryptU32(42, contractAddress, userAddress);
 * ```
 * 
 * @module core
 */

export { FhevmClient } from "./client.js";
export type {
  FhevmConfig,
  FhevmStatus,
  EncryptedInput,
  DecryptRequest,
  DecryptResult,
  FhevmType,
} from "./types.js";
