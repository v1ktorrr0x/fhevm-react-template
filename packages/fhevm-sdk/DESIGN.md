# FHEVM SDK Design - Framework-Agnostic Architecture

**Date**: October 22, 2025  
**Status**: Design Phase  
**Goal**: Refactor SDK into framework-agnostic core with wagmi-like API

---

## Current Architecture Analysis

### What Exists Today

**Core Logic** (`internal/fhevm.ts`):
- `createFhevmInstance()` - Main initialization function
- Handles both real networks (Sepolia) and mock networks (Hardhat localhost)
- Loads Relayer SDK dynamically for production
- Uses dynamic import for mock implementation (good for bundle size)
- Manages public key storage via IndexedDB
- Supports abort signals for cancellation

**React Hooks**:
- `useFhevm()` - Main hook for FHEVM instance lifecycle
- `useFHEEncryption()` - Encryption utilities
- `useFHEDecrypt()` - Decryption with EIP-712 signing

**Dependencies**:
- Currently in `peerDependencies`: `@zama-fhe/relayer-sdk`, `ethers`, `react`
- Should move to `dependencies`: `@zama-fhe/relayer-sdk`, `ethers`
- Keep as `peerDependencies`: `react` only

### What's Framework-Agnostic vs React-Specific

**✅ Framework-Agnostic (can be extracted)**:
- FHEVM instance creation logic
- Network detection (mock vs real)
- Public key storage (IndexedDB)
- Encryption methods
- Decryption methods (userDecrypt, publicDecrypt)
- EIP-712 signature handling

**❌ React-Specific (stays in react/)**:
- `useState`, `useEffect`, `useCallback`, `useMemo`
- Component lifecycle management
- Abort controller management via `useRef`

---

## New Architecture Design

### Core Package Structure

```
packages/fhevm-sdk/src/
├── core/
│   ├── client.ts           # NEW: FhevmClient class (main API)
│   ├── types.ts            # NEW: Core type definitions
│   ├── encryption.ts       # NEW: Encryption utilities
│   ├── decryption.ts       # NEW: Decryption utilities
│   └── index.ts            # Export core API
├── internal/               # KEEP: Existing implementation (for now)
│   ├── fhevm.ts           # Keep for reference during migration
│   ├── RelayerSDKLoader.ts
│   ├── PublicKeyStorage.ts
│   └── mock/
│       └── fhevmMock.ts
├── react/                  # REFACTOR: Use core client
│   ├── useFhevmClient.ts  # NEW: Main hook using FhevmClient
│   ├── useEncrypt.ts      # NEW: Encryption hook
│   ├── useDecrypt.ts      # NEW: Decryption hook
│   ├── useFhevm.tsx       # KEEP: Deprecated but working
│   ├── useFHEEncryption.ts # KEEP: Deprecated but working
│   └── useFHEDecrypt.ts   # KEEP: Deprecated but working
├── storage/
│   └── GenericStringStorage.ts
└── fhevmTypes.ts
```

---

## Core API Design

### FhevmClient Class

```typescript
// packages/fhevm-sdk/src/core/types.ts

export interface FhevmConfig {
  /** EIP-1193 provider or RPC URL */
  provider: string | Eip1193Provider;
  
  /** Chain ID (optional, will be detected) */
  chainId?: number;
  
  /** Mock chain mappings for testing (e.g., { 31337: "http://localhost:8545" }) */
  mockChains?: Record<number, string>;
  
  /** Abort signal for cancellation */
  signal?: AbortSignal;
  
  /** Status change callback */
  onStatusChange?: (status: FhevmStatus) => void;
}

export type FhevmStatus = 
  | "idle"
  | "sdk-loading"
  | "sdk-loaded"
  | "sdk-initializing"
  | "sdk-initialized"
  | "creating"
  | "ready"
  | "error";

export interface EncryptedInput {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}

export interface DecryptRequest {
  handle: string;
  contractAddress: `0x${string}`;
}

export interface DecryptResult {
  [handle: string]: string | bigint | boolean;
}
```

```typescript
// packages/fhevm-sdk/src/core/client.ts

import { FhevmInstance } from "../fhevmTypes";
import { createFhevmInstance } from "../internal/fhevm";

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
   * @example
   * ```typescript
   * const client = await FhevmClient.create({
   *   provider: window.ethereum,
   *   chainId: 31337
   * });
   * ```
   */
  static async create(config: FhevmConfig): Promise<FhevmClient> {
    const abortController = new AbortController();
    const signal = config.signal || abortController.signal;
    
    const instance = await createFhevmInstance({
      provider: config.provider as any,
      mockChains: config.mockChains,
      signal,
      onStatusChange: config.onStatusChange,
    });
    
    return new FhevmClient(instance, config);
  }

  /**
   * Check if client is ready to use
   */
  isReady(): boolean {
    return this.status === "ready" && !!this.instance;
  }

  /**
   * Get the public key for encryption
   */
  getPublicKey(): string {
    if (!this.instance) throw new Error("Client not ready");
    return this.instance.getPublicKey();
  }

  /**
   * Get the underlying FHEVM instance (for advanced use)
   */
  getInstance(): FhevmInstance {
    if (!this.instance) throw new Error("Client not ready");
    return this.instance;
  }

  // Encryption methods (to be implemented)
  async encrypt(value: number | bigint, type: FhevmType): Promise<EncryptedInput> { ... }
  async encryptBool(value: boolean): Promise<EncryptedInput> { ... }
  async encryptU8(value: number): Promise<EncryptedInput> { ... }
  async encryptU16(value: number): Promise<EncryptedInput> { ... }
  async encryptU32(value: number): Promise<EncryptedInput> { ... }
  async encryptU64(value: bigint): Promise<EncryptedInput> { ... }

  // Decryption methods (to be implemented)
  async userDecrypt(
    requests: DecryptRequest[],
    signer: JsonRpcSigner
  ): Promise<DecryptResult> { ... }
  
  async publicDecrypt(handle: string): Promise<bigint> { ... }
}
```

---

## React Hooks Design

### New Hooks Using Core Client

```typescript
// packages/fhevm-sdk/src/react/useFhevmClient.ts

export function useFhevmClient(config: {
  provider: string | Eip1193Provider | undefined;
  chainId: number | undefined;
  enabled?: boolean;
  mockChains?: Record<number, string>;
}): {
  client: FhevmClient | undefined;
  status: FhevmStatus;
  error: Error | undefined;
  refresh: () => void;
} {
  const [client, setClient] = useState<FhevmClient>();
  const [status, setStatus] = useState<FhevmStatus>("idle");
  const [error, setError] = useState<Error>();
  
  useEffect(() => {
    if (!config.enabled || !config.provider) return;
    
    const abortController = new AbortController();
    
    FhevmClient.create({
      provider: config.provider,
      chainId: config.chainId,
      mockChains: config.mockChains,
      signal: abortController.signal,
      onStatusChange: setStatus,
    })
      .then(setClient)
      .catch(setError);
    
    return () => abortController.abort();
  }, [config.provider, config.chainId, config.enabled]);
  
  return { client, status, error, refresh };
}
```

```typescript
// packages/fhevm-sdk/src/react/useEncrypt.ts

export function useEncrypt(params: {
  client: FhevmClient | undefined;
  signer: JsonRpcSigner | undefined;
  contractAddress: `0x${string}` | undefined;
}) {
  const { client, signer, contractAddress } = params;
  
  const canEncrypt = useMemo(
    () => Boolean(client?.isReady() && signer && contractAddress),
    [client, signer, contractAddress]
  );
  
  const encrypt = useCallback(async (value: number, type: FhevmType) => {
    if (!client || !canEncrypt) throw new Error("Cannot encrypt");
    return client.encrypt(value, type);
  }, [client, canEncrypt]);
  
  return { canEncrypt, encrypt, encryptBool, encryptU8, ... };
}
```

```typescript
// packages/fhevm-sdk/src/react/useDecrypt.ts

export function useDecrypt(params: {
  client: FhevmClient | undefined;
  signer: JsonRpcSigner | undefined;
  requests: DecryptRequest[] | undefined;
}) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [results, setResults] = useState<DecryptResult>({});
  
  const decrypt = useCallback(async () => {
    if (!client || !signer || !requests) return;
    
    setIsDecrypting(true);
    try {
      const result = await client.userDecrypt(requests, signer);
      setResults(result);
    } finally {
      setIsDecrypting(false);
    }
  }, [client, signer, requests]);
  
  return { decrypt, isDecrypting, results };
}
```

---

## Migration Strategy

### Phase 1: Create Core (Non-Breaking)

1. ✅ Move dependencies from peerDeps to deps
2. ✅ Create `core/client.ts` with basic structure
3. ✅ Extract initialization logic from `internal/fhevm.ts`
4. ✅ Implement encryption methods
5. ✅ Implement decryption methods
6. ✅ Write tests for core client

**Key**: Keep `internal/fhevm.ts` unchanged. New core uses it internally.

### Phase 2: Create New React Hooks (Non-Breaking)

1. ✅ Create `useFhevmClient()` using core
2. ✅ Create `useEncrypt()` using core
3. ✅ Create `useDecrypt()` using core
4. ✅ Add deprecation warnings to old hooks
5. ✅ Keep old hooks working

**Key**: Both old and new APIs work simultaneously.

### Phase 3: Update Next.js Showcase

1. ✅ Create new example component using new API
2. ✅ Keep old component for comparison
3. ✅ Update main demo to use new API
4. ✅ Test everything works

### Phase 4: Examples & Documentation

1. ✅ Create Node.js example
2. ✅ Create Vue example (optional)
3. ✅ Write comprehensive docs
4. ✅ Record video walkthrough

---

## Key Design Decisions

### 1. Keep `internal/fhevm.ts` Initially

**Why**: Minimize risk. The existing `createFhevmInstance()` works well. We'll use it internally in `FhevmClient.create()` rather than rewriting from scratch.

**Later**: Can refactor internals once core API is stable.

### 2. Move Dependencies to Regular Deps

**Why**: Users should only install `@fhevm-sdk`. They shouldn't manage `@zama-fhe/relayer-sdk` and `ethers` versions.

**Exception**: Keep `react` as peerDep since it's framework-specific.

### 3. Class-Based Core API

**Why**: 
- Encapsulates state (instance, config)
- Familiar to developers (like ethers.Contract)
- Easy to extend
- Works in any JavaScript environment

### 4. Backward Compatibility

**Why**: Next.js showcase must keep working. Old hooks stay functional with deprecation warnings.

### 5. Dynamic Imports for Mock

**Why**: Keep production bundle small. Mock code only loads for localhost/testing.

---

## Success Criteria

### Week 1 Complete When:
- [ ] `FhevmClient` class working
- [ ] Can create instance
- [ ] Can encrypt values
- [ ] Can decrypt values
- [ ] Tests passing (>50% coverage)
- [ ] Next.js app still works with old API

### Week 2 Complete When:
- [ ] New React hooks working
- [ ] Next.js showcase updated to new API
- [ ] Node.js example created
- [ ] Tests passing (>70% coverage)

### Week 3 Complete When:
- [ ] Documentation complete
- [ ] Video recorded
- [ ] Showcase deployed
- [ ] Tests passing (>80% coverage)
- [ ] Ready to submit

---

## API Usage Examples

### Node.js (Framework-Agnostic)

```typescript
import { FhevmClient } from '@fhevm-sdk/core';
import { JsonRpcProvider } from 'ethers';

// Create client
const client = await FhevmClient.create({
  provider: 'http://localhost:8545',
  chainId: 31337
});

// Encrypt
const encrypted = await client.encryptU32(42);

// Use in contract call
const contract = new Contract(address, abi, signer);
const tx = await contract.increment(encrypted.handles[0], encrypted.inputProof);
await tx.wait();

// Decrypt
const result = await client.userDecrypt([
  { handle: countHandle, contractAddress: address }
], signer);

console.log('Decrypted value:', result[countHandle]);
```

### React (New API)

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm-sdk/react';

function Counter() {
  const { client, status } = useFhevmClient({
    provider: window.ethereum,
    chainId: 31337
  });
  
  const { encrypt } = useEncrypt({
    client,
    signer,
    contractAddress
  });
  
  const { decrypt, results } = useDecrypt({
    client,
    signer,
    requests: [{ handle, contractAddress }]
  });
  
  // Use encrypt/decrypt...
}
```

### Vue (Composable)

```typescript
import { FhevmClient } from '@fhevm-sdk/core';
import { ref, onMounted } from 'vue';

export function useFhevm(config) {
  const client = ref<FhevmClient>();
  const status = ref('idle');
  
  onMounted(async () => {
    client.value = await FhevmClient.create(config);
    status.value = 'ready';
  });
  
  return { client, status };
}
```

---

## Next Steps

1. Update `package.json` dependencies
2. Create `core/types.ts`
3. Create `core/client.ts` with basic structure
4. Write first test
5. Implement `FhevmClient.create()`
6. Make test pass

**Target**: Complete Day 1-2 tasks by end of today.
