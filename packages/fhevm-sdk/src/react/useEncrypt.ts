import { useCallback, useMemo } from "react";
import type { FhevmClient } from "../core/client.js";
import type { EncryptedInput, FhevmType } from "../core/types.js";

/**
 * React hook for encrypting values with FHEVM
 * 
 * Provides convenient encryption methods that work with the FhevmClient.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client } = useFhevmClient({ ... });
 *   const { encrypt, encryptU32, canEncrypt } = useEncrypt({
 *     client,
 *     contractAddress: '0x...',
 *     userAddress: '0x...'
 *   });
 *   
 *   const handleEncrypt = async () => {
 *     if (!canEncrypt) return;
 *     const encrypted = await encryptU32(42);
 *     // Use encrypted.handles and encrypted.inputProof in contract call
 *   };
 * }
 * ```
 */
export function useEncrypt(parameters: {
  /** FHEVM client instance */
  client: FhevmClient | undefined;
  /** Contract address for encryption */
  contractAddress: string | undefined;
  /** User address for encryption */
  userAddress: string | undefined;
}): {
  /** Whether encryption is ready */
  canEncrypt: boolean;
  /** Generic encrypt function */
  encrypt: (value: number | bigint | boolean, type: FhevmType) => Promise<EncryptedInput>;
  /** Encrypt boolean value */
  encryptBool: (value: boolean) => Promise<EncryptedInput>;
  /** Encrypt uint8 value */
  encryptU8: (value: number) => Promise<EncryptedInput>;
  /** Encrypt uint16 value */
  encryptU16: (value: number) => Promise<EncryptedInput>;
  /** Encrypt uint32 value */
  encryptU32: (value: number) => Promise<EncryptedInput>;
  /** Encrypt uint64 value */
  encryptU64: (value: bigint) => Promise<EncryptedInput>;
} {
  const { client, contractAddress, userAddress } = parameters;

  const canEncrypt = useMemo(
    () => Boolean(client?.isReady() && contractAddress && userAddress),
    [client, contractAddress, userAddress]
  );

  const encrypt = useCallback(
    async (value: number | bigint | boolean, type: FhevmType): Promise<EncryptedInput> => {
      if (!client || !contractAddress || !userAddress) {
        throw new Error("Cannot encrypt: client, contractAddress, or userAddress not ready");
      }
      return client.encrypt(value, type, contractAddress, userAddress);
    },
    [client, contractAddress, userAddress]
  );

  const encryptBool = useCallback(
    async (value: boolean): Promise<EncryptedInput> => {
      if (!client || !contractAddress || !userAddress) {
        throw new Error("Cannot encrypt: client, contractAddress, or userAddress not ready");
      }
      return client.encryptBool(value, contractAddress, userAddress);
    },
    [client, contractAddress, userAddress]
  );

  const encryptU8 = useCallback(
    async (value: number): Promise<EncryptedInput> => {
      if (!client || !contractAddress || !userAddress) {
        throw new Error("Cannot encrypt: client, contractAddress, or userAddress not ready");
      }
      return client.encryptU8(value, contractAddress, userAddress);
    },
    [client, contractAddress, userAddress]
  );

  const encryptU16 = useCallback(
    async (value: number): Promise<EncryptedInput> => {
      if (!client || !contractAddress || !userAddress) {
        throw new Error("Cannot encrypt: client, contractAddress, or userAddress not ready");
      }
      return client.encryptU16(value, contractAddress, userAddress);
    },
    [client, contractAddress, userAddress]
  );

  const encryptU32 = useCallback(
    async (value: number): Promise<EncryptedInput> => {
      if (!client || !contractAddress || !userAddress) {
        throw new Error("Cannot encrypt: client, contractAddress, or userAddress not ready");
      }
      return client.encryptU32(value, contractAddress, userAddress);
    },
    [client, contractAddress, userAddress]
  );

  const encryptU64 = useCallback(
    async (value: bigint): Promise<EncryptedInput> => {
      if (!client || !contractAddress || !userAddress) {
        throw new Error("Cannot encrypt: client, contractAddress, or userAddress not ready");
      }
      return client.encryptU64(value, contractAddress, userAddress);
    },
    [client, contractAddress, userAddress]
  );

  return {
    canEncrypt,
    encrypt,
    encryptBool,
    encryptU8,
    encryptU16,
    encryptU32,
    encryptU64,
  };
}
