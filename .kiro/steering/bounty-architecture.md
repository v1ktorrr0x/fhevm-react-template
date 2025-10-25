# Bounty Architecture Guidelines

## SDK Design Principles

### Framework-Agnostic Core

The SDK must have a clear separation between:
- **Core logic** - Pure TypeScript, no framework dependencies
- **Framework adapters** - React hooks, Vue composables, etc.

```
packages/fhevm-sdk/
├── src/
│   ├── core/           # Framework-agnostic core
│   ├── react/          # React-specific hooks/adapters
│   ├── vue/            # Vue-specific composables (bonus)
│   └── node/           # Node.js utilities (bonus)
```

### Wagmi-Like API Structure

Developers familiar with wagmi should feel at home:
- Modular hooks/composables
- Clear separation of concerns
- Predictable naming conventions
- Type-safe APIs

Example patterns:
- `useFHEVM()` - Main initialization hook
- `useEncryptedInput()` - Handle encrypted inputs
- `useUserDecrypt()` - User decryption with EIP-712
- `usePublicDecrypt()` - Public decryption

### Single Dependency Philosophy

Developers should only need:
```bash
pnpm add @fhevm-sdk
```

The SDK internally manages:
- @zama-fhe/relayer-sdk
- ethers or viem
- idb (IndexedDB)
- Any other required dependencies

## Key Features to Implement

### 1. Initialization
- Simple setup with minimal configuration
- Support for multiple networks (localhost, Sepolia)
- Connection to FHEVM gateway/relayer

### 2. Encrypted Inputs
- Easy-to-use API for creating encrypted inputs
- Type-safe encryption methods
- Support for all FHEVM types (euint8, euint16, euint32, etc.)

### 3. Decryption Flows

**User Decrypt (EIP-712)**:
- Request decryption permission from user
- Sign with EIP-712
- Handle async decryption flow
- Cache results appropriately

**Public Decrypt**:
- Direct decryption for public values
- No signature required

### 4. Contract Interactions
- Type-safe contract calls
- Automatic ABI handling
- Integration with generated contract types

## Code Quality Standards

- **TypeScript**: Strict mode, full type coverage
- **Testing**: Vitest with >80% coverage
- **Documentation**: JSDoc comments on all public APIs
- **Examples**: Working code samples for each feature
- **Error Handling**: Clear, actionable error messages

## Performance Considerations

- Lazy loading of framework-specific code
- Efficient caching strategies (IndexedDB)
- Minimal bundle size for core package
- Tree-shakeable exports

## Developer Experience Goals

Target setup experience:
```typescript
// 1. Install
// pnpm add @fhevm-sdk

// 2. Initialize (React example)
import { FHEVMProvider, useFHEVM } from '@fhevm-sdk/react'

// 3. Use in component
const { encrypt, decrypt } = useFHEVM()
const encrypted = await encrypt(42)
```

Should be <10 lines to get started with basic encryption/decryption.
