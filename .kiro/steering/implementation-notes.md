---
inclusion: always
---

# Implementation Notes - Universal FHEVM SDK

## Current Architecture

### Framework-Agnostic Core
- **Location**: `packages/fhevm-sdk/src/core/`
- **Purpose**: Pure TypeScript FHEVM operations, no framework dependencies
- **Key Classes**: `FhevmClient` - Wagmi-like API for FHEVM operations

### React Adapter
- **Location**: `packages/fhevm-sdk/src/react/`
- **Hooks**: `useFhevmClient`, `useEncrypt`, `useDecrypt`
- **Purpose**: React-specific wrappers around core client

### FHEVM Mock for Localhost
- **Location**: `packages/fhevm-sdk/src/internal/mock/fhevmMock.ts`
- **Uses**: `@fhevm/mock-utils` package
- **Purpose**: Real FHEVM operations on localhost Hardhat node
- **Important**: Dynamically imported to avoid bundling in production

## Key Implementation Details

### Localhost vs Production
- **Localhost (chainId 31337)**: Uses `@fhevm/mock-utils` with real encryption/decryption
- **Sepolia (chainId 11155111)**: Uses production relayer SDK
- Both support EIP-712 signatures for user decryption

### Signer Compatibility
- **Issue**: Wagmi provides viem `WalletClient`, SDK needs ethers `JsonRpcSigner`
- **Solution**: `useEthersSigner` hook in `packages/nextjs/hooks/useEthersSigner.ts`
- Converts viem WalletClient to ethers signer for SDK compatibility

### Dependencies
- `@zama-fhe/relayer-sdk`: Production FHEVM operations
- `@fhevm/mock-utils`: Localhost FHEVM mock (moved from peer to regular dependency)
- `ethers`: Ethereum interactions
- `idb`: IndexedDB for caching

## Original Template Reference
- **Path**: `fhevm-react-template/` (in project root)
- **Purpose**: Reference implementation from Zama
- **Use**: Check original behavior when debugging

## Bounty Requirements Met
1. ✅ Framework-agnostic core (`src/core/`)
2. ✅ Wagmi-like API structure
3. ✅ Single dependency (`@fhevm-sdk`)
4. ✅ Encryption/decryption with EIP-712
5. ✅ Works on localhost AND Sepolia
6. ✅ <10 lines to get started

## Testing Strategy
- **Unit tests**: `packages/fhevm-sdk/test/unit/`
- **Integration tests**: `packages/fhevm-sdk/test/integration/`
- **E2E tests**: `packages/fhevm-sdk/test/e2e/`
- **Target coverage**: >80%

## Common Commands
```bash
# Development
pnpm install          # Install + build SDK
pnpm chain            # Start Hardhat node
pnpm deploy:localhost # Deploy contracts
pnpm start            # Start Next.js

# SDK Development
pnpm sdk:build        # Build SDK
pnpm sdk:watch        # Watch mode
pnpm sdk:test         # Run tests

# Production
pnpm deploy:sepolia   # Deploy to Sepolia
pnpm next:build       # Production build
```

## Important Notes
- Always use dynamic imports for mock to avoid production bundle bloat
- Keep core logic framework-agnostic
- Test on both localhost and Sepolia before submission
- Maintain backward compatibility with existing Next.js showcase
