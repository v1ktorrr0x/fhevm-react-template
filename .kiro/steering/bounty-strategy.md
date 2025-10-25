# 100x Senior Developer Strategy: Universal FHEVM SDK

## Executive Summary

**Goal**: Refactor the existing SDK into a framework-agnostic architecture without breaking the Next.js showcase.

**Key Insight**: The current SDK already has good bones - it has core logic, React hooks, and proper exports. We need to **refactor incrementally** rather than rebuild from scratch.

## Current State Analysis

### What's Already Good ✅
- Modular structure with `core/`, `react/`, `storage/` separation
- Proper TypeScript with ESM output
- Vitest testing setup
- IndexedDB storage abstraction
- Mock support for local Hardhat testing
- Subpath exports in package.json

### What Needs Work 🔧
- Core logic has React/ethers coupling (needs extraction)
- No wagmi-like API patterns
- Missing comprehensive documentation
- No examples for other frameworks
- Dependencies are peer deps (should be bundled)
- Error handling could be more developer-friendly

## Non-Breaking Refactor Strategy

### Phase 1: Extract Pure Core (Week 1)

**Objective**: Create framework-agnostic core without breaking existing React code.

#### Step 1.1: Create New Core API Layer
```
packages/fhevm-sdk/src/
├── core/
│   ├── client.ts          # NEW: FhevmClient class (framework-agnostic)
│   ├── encryption.ts      # NEW: Pure encryption utilities
│   ├── decryption.ts      # NEW: Pure decryption utilities
│   ├── types.ts           # NEW: Core type definitions
│   └── index.ts           # Export new core API
├── internal/              # KEEP: Existing implementation
│   └── ...                # Don't touch yet - React still uses this
└── react/
    └── ...                # KEEP: Existing hooks work as-is
```

**Key Decision**: Don't delete `internal/` yet. Create new core alongside it.

#### Step 1.2: Design Wagmi-Like API
```typescript
// NEW: packages/fhevm-sdk/src/core/client.ts
export class FhevmClient {
  // Framework-agnostic initialization
  static async create(config: FhevmConfig): Promise<FhevmClient>
  
  // Encryption methods
  encrypt(value: number | bigint, type: FhevmType): Promise<EncryptedInput>
  encryptBool(value: boolean): Promise<EncryptedInput>
  encryptU8(value: number): Promise<EncryptedInput>
  encryptU16(value: number): Promise<EncryptedInput>
  encryptU32(value: number): Promise<EncryptedInput>
  
  // Decryption methods
  userDecrypt(handle: string, contractAddress: string): Promise<bigint>
  publicDecrypt(handle: string): Promise<bigint>
  
  // Utilities
  getPublicKey(): string
  isReady(): boolean
}
```

#### Step 1.3: Move Dependencies from Peer to Regular
```json
// package.json changes
{
  "dependencies": {
    "idb": "^8.0.3",
    "@zama-fhe/relayer-sdk": "^0.2.0",  // MOVE from peerDeps
    "ethers": "^6.13.4"                  // MOVE from peerDeps
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"        // KEEP only React as peer
  }
}
```

**Why**: Users should only install `@fhevm-sdk`, not manage multiple packages.

### Phase 2: Refactor React Hooks (Week 1-2)

**Objective**: Update React hooks to use new core API while maintaining backward compatibility.

#### Step 2.1: Create New React Hooks Using Core
```typescript
// NEW: packages/fhevm-sdk/src/react/useFhevmClient.ts
export function useFhevmClient(config: FhevmConfig) {
  const [client, setClient] = useState<FhevmClient>()
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  
  useEffect(() => {
    // Use FhevmClient.create() from core
  }, [config])
  
  return { client, status, error }
}

// NEW: packages/fhevm-sdk/src/react/useEncrypt.ts
export function useEncrypt(client?: FhevmClient) {
  const encrypt = useCallback(async (value, type) => {
    if (!client) throw new Error('Client not ready')
    return client.encrypt(value, type)
  }, [client])
  
  return { encrypt, isReady: !!client }
}

// NEW: packages/fhevm-sdk/src/react/useDecrypt.ts
export function useDecrypt(client?: FhevmClient) {
  const userDecrypt = useCallback(async (handle, address) => {
    if (!client) throw new Error('Client not ready')
    return client.userDecrypt(handle, address)
  }, [client])
  
  return { userDecrypt, publicDecrypt: ... }
}
```

#### Step 2.2: Keep Old Hooks as Compatibility Layer
```typescript
// KEEP: packages/fhevm-sdk/src/react/useFhevm.tsx
// Add deprecation notice but keep working
/**
 * @deprecated Use useFhevmClient instead
 */
export function useFhevm(params) {
  // Keep existing implementation
  // Add console.warn about deprecation
}
```

#### Step 2.3: Update Next.js Showcase Gradually
- First: Ensure old API still works (no breaking changes)
- Then: Create new example components using new API
- Finally: Update main demo to use new API
- Keep old examples in separate folder for reference

### Phase 3: Add Framework Examples (Week 2)

**Objective**: Demonstrate framework-agnostic nature with minimal examples.

#### Step 3.1: Plain Node.js Example
```
examples/
├── node-js/
│   ├── package.json
│   ├── index.js
│   └── README.md
```

Simple script showing:
- Initialize FhevmClient
- Encrypt a value
- Call contract
- Decrypt result

#### Step 3.2: Vue.js Example (Bonus)
```
examples/
├── vue/
│   ├── src/
│   │   ├── composables/
│   │   │   └── useFhevm.ts    # Vue composable wrapping core
│   │   └── App.vue
│   └── package.json
```

Show how to create Vue composables from core API.

### Phase 4: Documentation & Polish (Week 3)

**Objective**: Make SDK discoverable and easy to use.

#### Step 4.1: API Documentation
```
docs/
├── getting-started.md
├── api/
│   ├── core.md
│   ├── react.md
│   └── vue.md
├── examples/
│   ├── encryption.md
│   ├── decryption.md
│   └── contract-interaction.md
└── migration-guide.md
```

#### Step 4.2: Improve Error Messages
```typescript
// Before
throw new Error("window.relayerSDK is not available")

// After
throw new FhevmError(
  'RELAYER_SDK_NOT_LOADED',
  'FHEVM Relayer SDK is not available. This usually means:\n' +
  '1. You are not on a supported network (Sepolia or localhost)\n' +
  '2. The SDK failed to load from CDN\n' +
  '3. You are in a non-browser environment\n\n' +
  'See: https://docs.zama.ai/fhevm-sdk/troubleshooting#relayer-sdk'
)
```

#### Step 4.3: Add JSDoc Comments
```typescript
/**
 * Creates a new FHEVM client instance.
 * 
 * @param config - Configuration options
 * @param config.provider - Ethereum provider (EIP-1193) or RPC URL
 * @param config.chainId - Chain ID (31337 for localhost, 11155111 for Sepolia)
 * @param config.mockChains - Optional mapping of chain IDs to RPC URLs for testing
 * 
 * @returns Promise resolving to FhevmClient instance
 * 
 * @example
 * ```typescript
 * const client = await FhevmClient.create({
 *   provider: window.ethereum,
 *   chainId: 31337
 * })
 * ```
 */
```

## Risk Mitigation

### Risk 1: Breaking Next.js Showcase
**Mitigation**: 
- Keep old API working alongside new API
- Test Next.js app after each change
- Use feature flags to toggle between old/new implementations

### Risk 2: Time Constraints
**Mitigation**:
- Focus on core SDK first (70% effort)
- Next.js showcase is secondary (20% effort)
- Bonus features only if time permits (10% effort)
- Have working version by Oct 28 (3 days buffer)

### Risk 3: Dependency Hell
**Mitigation**:
- Move dependencies to regular deps (not peer)
- Lock versions in package.json
- Test with fresh `pnpm install`

### Risk 4: Mock Testing Breaks
**Mitigation**:
- Keep mock implementation in `internal/mock/`
- Don't touch mock code until core is stable
- Test both mock and real networks

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// Test core client
describe('FhevmClient', () => {
  it('creates instance with valid config')
  it('encrypts values correctly')
  it('handles errors gracefully')
})

// Test React hooks
describe('useFhevmClient', () => {
  it('initializes client on mount')
  it('handles provider changes')
  it('cleans up on unmount')
})
```

### Integration Tests
```typescript
// Test full flow
describe('E2E Flow', () => {
  it('encrypts → calls contract → decrypts')
  it('works with mock Hardhat node')
  it('handles network switches')
})
```

### Manual Testing Checklist
- [ ] Next.js app loads without errors
- [ ] Can connect wallet
- [ ] Can increment/decrement counter
- [ ] Can decrypt counter value
- [ ] Works on localhost (mock)
- [ ] Works on Sepolia (if deployed)
- [ ] Node.js example runs
- [ ] Vue example runs (if created)

## Implementation Timeline

### Week 1 (Oct 8-14)
- Day 1-2: Design core API, create `FhevmClient` class
- Day 3-4: Implement encryption/decryption in core
- Day 5-6: Create new React hooks using core
- Day 7: Test Next.js app with new hooks

### Week 2 (Oct 15-21)
- Day 1-2: Update Next.js showcase to use new API
- Day 3-4: Create Node.js example
- Day 5-6: Create Vue example (if time permits)
- Day 7: Write tests, fix bugs

### Week 3 (Oct 22-28)
- Day 1-2: Write documentation
- Day 3-4: Polish error messages, add JSDoc
- Day 5: Record video walkthrough
- Day 6: Deploy showcase, final testing
- Day 7: Buffer for unexpected issues

### Buffer (Oct 29-31)
- Final review
- Fix any last-minute issues
- Submit before deadline

## Success Criteria

### Must Have (Required for Submission)
- [ ] Framework-agnostic core API
- [ ] Wagmi-like React hooks
- [ ] Next.js showcase working and deployed
- [ ] Comprehensive README with examples
- [ ] Video walkthrough
- [ ] All tests passing
- [ ] No breaking changes to existing Next.js app

### Should Have (Competitive Advantage)
- [ ] Node.js example
- [ ] Excellent documentation
- [ ] >80% test coverage
- [ ] Clear error messages
- [ ] Migration guide from old API

### Nice to Have (Bonus Points)
- [ ] Vue.js example
- [ ] CLI tool for quick setup
- [ ] Interactive documentation
- [ ] Performance benchmarks

## Key Principles

1. **Don't Break Things**: Keep old API working while building new one
2. **Incremental Progress**: Small, testable changes
3. **Test Everything**: Run tests after each change
4. **Document As You Go**: Write docs while code is fresh
5. **Focus on Core**: SDK quality > number of examples
6. **Ship Early**: Have working version 3 days before deadline
7. **Ask for Help**: Check GitHub issues, Discord for guidance

## Final Checklist Before Submission

- [ ] Fork has commit history preserved
- [ ] All deliverables in README (demo link, video link)
- [ ] Code is formatted and linted
- [ ] Tests pass with good coverage
- [ ] Documentation is complete
- [ ] Video walkthrough is uploaded
- [ ] Next.js showcase is deployed
- [ ] Examples work from fresh install
- [ ] No console errors in production build
- [ ] README has troubleshooting section
