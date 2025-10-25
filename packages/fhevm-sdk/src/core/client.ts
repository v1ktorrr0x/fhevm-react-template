import type { JsonRpcSigner } from "ethers";
import type { FhevmInstance } from "../fhevmTypes.js";
import { createFhevmInstance } from "../internal/fhevm.js";
import type {
  FhevmConfig,
  FhevmStatus,
  EncryptedInput,
  DecryptRequest,
  DecryptResult,
  FhevmType,
} from "./types.js";

/**
 * Framework-agnostic FHEVM client
 * 
 * Provides a clean, wagmi-like API for FHEVM operations:
 * - Initialization
 * - Encryption
 * - Decryption
 * 
 * Works in any JavaScript environment (Node.js, React, Vue, etc.)
 * 
 * @example
 * ```typescript
 * // Create client
 * const client = await FhevmClient.create({
 *   provider: window.ethereum,
 *   chainId: 31337
 * });
 * 
 * // Encrypt
 * const encrypted = await client.encryptU32(42);
 * 
 * // Decrypt
 * const result = await client.userDecrypt([
 *   { handle: '0x...', contractAddress: '0x...' }
 * ], signer);
 * ```
 */
export class FhevmClient {
  private instance: FhevmInstance;
  private config: FhevmConfig;
  private status: FhevmStatus = "idle";

  private constructor(instance: FhevmInstance, config: FhevmConfig) {
    this.instance = instance;
    this.config = config;
    this.status = "ready";
  }

  /**
   * Create a new FHEVM client instance
   * 
   * @param config - Configuration options
   * @returns Promise resolving to FhevmClient instance
   * 
   * @example
   * ```typescript
   * const client = await FhevmClient.create({
   *   provider: window.ethereum,
   *   chainId: 11155111
   * });
   * ```
   */
  static async create(config: FhevmConfig): Promise<FhevmClient> {
    const abortController = new AbortController();
    const signal = config.signal || abortController.signal;
    
    const instance = await createFhevmInstance({
      provider: config.provider as any,
      chainId: config.chainId,
      mockChains: config.mockChains,
      signal,
      onStatusChange: config.onStatusChange,
    });
    
    return new FhevmClient(instance, config);
  }

  /**
   * Check if client is ready to use
   * 
   * @returns true if client is initialized and ready
   */
  isReady(): boolean {
    return this.status === "ready" && !!this.instance;
  }

  /**
   * Get the current status of the client
   * 
   * @returns Current status
   */
  getStatus(): FhevmStatus {
    return this.status;
  }

  /**
   * Get the public key for encryption
   * 
   * @returns Public key object with publicKeyId and publicKey
   * @throws Error if client is not ready
   */
  getPublicKey(): { publicKeyId: string; publicKey: Uint8Array } | null {
    if (!this.instance) {
      throw new Error("FhevmClient not ready. Call create() first.");
    }
    return this.instance.getPublicKey();
  }

  /**
   * Get the underlying FHEVM instance (for advanced use)
   * 
   * @returns The FHEVM instance
   * @throws Error if client is not ready
   */
  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error("FhevmClient not ready. Call create() first.");
    }
    return this.instance;
  }

  /**
   * Encrypt a value with specified type
   * 
   * @param value - Value to encrypt
   * @param type - FHEVM type
   * @param contractAddress - Contract address
   * @param userAddress - User address
   * @returns Encrypted input
   * 
   * @example
   * ```typescript
   * const encrypted = await client.encrypt(42, 'uint32', contractAddress, userAddress);
   * ```
   */
  async encrypt(
    value: number | bigint | boolean,
    type: FhevmType,
    contractAddress: string,
    userAddress: string
  ): Promise<EncryptedInput> {
    if (!this.instance) {
      throw new Error("FhevmClient not ready");
    }

    const input = this.instance.createEncryptedInput(contractAddress, userAddress);
    
    // Add value based on type
    switch (type) {
      case "bool":
        input.addBool(Boolean(value));
        break;
      case "uint8":
        input.add8(Number(value));
        break;
      case "uint16":
        input.add16(Number(value));
        break;
      case "uint32":
        input.add32(Number(value));
        break;
      case "uint64":
        input.add64(BigInt(value));
        break;
      case "uint128":
        input.add128(BigInt(value));
        break;
      case "uint256":
        input.add256(BigInt(value));
        break;
      case "address":
        input.addAddress(String(value));
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }

    return await input.encrypt();
  }

  /**
   * Encrypt a boolean value
   * 
   * @param value - Boolean value to encrypt
   * @param contractAddress - Contract address
   * @param userAddress - User address
   * @returns Encrypted input
   */
  async encryptBool(
    value: boolean,
    contractAddress: string,
    userAddress: string
  ): Promise<EncryptedInput> {
    return this.encrypt(value, "bool", contractAddress, userAddress);
  }

  /**
   * Encrypt a uint8 value
   * 
   * @param value - Number to encrypt (0-255)
   * @param contractAddress - Contract address
   * @param userAddress - User address
   * @returns Encrypted input
   */
  async encryptU8(
    value: number,
    contractAddress: string,
    userAddress: string
  ): Promise<EncryptedInput> {
    return this.encrypt(value, "uint8", contractAddress, userAddress);
  }

  /**
   * Encrypt a uint16 value
   * 
   * @param value - Number to encrypt (0-65535)
   * @param contractAddress - Contract address
   * @param userAddress - User address
   * @returns Encrypted input
   */
  async encryptU16(
    value: number,
    contractAddress: string,
    userAddress: string
  ): Promise<EncryptedInput> {
    return this.encrypt(value, "uint16", contractAddress, userAddress);
  }

  /**
   * Encrypt a uint32 value
   * 
   * @param value - Number to encrypt
   * @param contractAddress - Contract address
   * @param userAddress - User address
   * @returns Encrypted input
   */
  async encryptU32(
    value: number,
    contractAddress: string,
    userAddress: string
  ): Promise<EncryptedInput> {
    return this.encrypt(value, "uint32", contractAddress, userAddress);
  }

  /**
   * Encrypt a uint64 value
   * 
   * @param value - BigInt to encrypt
   * @param contractAddress - Contract address
   * @param userAddress - User address
   * @returns Encrypted input
   */
  async encryptU64(
    value: bigint,
    contractAddress: string,
    userAddress: string
  ): Promise<EncryptedInput> {
    return this.encrypt(value, "uint64", contractAddress, userAddress);
  }

  /**
   * Decrypt encrypted handles using user's private key (EIP-712 signing)
   * 
   * @param requests - Array of decrypt requests
   * @param signer - Ethers signer for EIP-712 signing
   * @returns Decrypted values mapped by handle
   * 
   * @example
   * ```typescript
   * const result = await client.userDecrypt([
   *   { handle: '0x...', contractAddress: '0x...' }
   * ], signer);
   * console.log(result['0x...']); // Decrypted value
   * ```
   */
  async userDecrypt(
    requests: DecryptRequest[],
    signer: JsonRpcSigner
  ): Promise<DecryptResult> {
    if (!this.instance) {
      throw new Error("FhevmClient not ready");
    }

    // Import decryption signature helper
    const { FhevmDecryptionSignature } = await import("../FhevmDecryptionSignature.js");
    const { GenericStringInMemoryStorage } = await import("../storage/index.js");
    
    // Create in-memory storage for signature
    const storage = new GenericStringInMemoryStorage();
    
    // Get unique contract addresses
    const uniqueAddresses = Array.from(
      new Set(requests.map(r => r.contractAddress))
    ) as `0x${string}`[];
    
    // Load or create signature
    const sig = await FhevmDecryptionSignature.loadOrSign(
      this.instance,
      uniqueAddresses,
      signer,
      storage
    );
    
    if (!sig) {
      throw new Error("Failed to create decryption signature");
    }
    
    // Perform decryption
    const result = await this.instance.userDecrypt(
      requests.map(r => ({ handle: r.handle, contractAddress: r.contractAddress })),
      sig.privateKey,
      sig.publicKey,
      sig.signature,
      sig.contractAddresses,
      sig.userAddress,
      sig.startTimestamp,
      sig.durationDays
    );
    
    return result;
  }

  /**
   * Decrypt public handles (no signature required)
   * 
   * @param handles - Array of handles to decrypt
   * @returns Decrypted results
   * 
   * @example
   * ```typescript
   * const results = await client.publicDecrypt(['0x...']);
   * console.log(results); // { '0x...': 42n }
   * ```
   */
  async publicDecrypt(handles: string[]): Promise<DecryptResult> {
    if (!this.instance) {
      throw new Error("FhevmClient not ready");
    }

    // Public decrypt doesn't require signature
    const result = await this.instance.publicDecrypt(handles);
    return result as DecryptResult;
  }
}
