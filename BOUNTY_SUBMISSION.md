# Universal FHEVM SDK - Bounty Submission

**Repository**: https://github.com/v1ktorrr0x/fhevm-react-template

---

## Architecture Overview

This submission presents a framework-agnostic FHEVM SDK that enables developers to build confidential dApps with minimal code in any JavaScript environment. The SDK features a pure TypeScript core with zero framework dependencies, making it reusable across React, Vue, Node.js, and other JavaScript frameworks.

---

## Architecture Approach

### Design Philosophy

The SDK implements a layered architecture with clear separation between framework-agnostic core logic and framework-specific adapters:

```
packages/fhevm-sdk/
└── src/
    ├── core/                    # Framework-agnostic layer
    │   ├── client.ts           # Pure TypeScript FHEVM client
    │   └── types.ts            # Core type definitions
    ├── react/                   # React adapter layer
    │   ├── useFhevmClient.ts   # Client lifecycle management
    │   ├── useEncrypt.ts       # Encryption operations
    │   └── useDecrypt.ts       # Decryption operations
    ├── internal/                # Implementation details
    │   ├── fhevm.ts            # Network detection & initialization
    │   └── mock/               # FHEVM mock for localhost
    └── storage/                 # Persistence utilities
```

### Key Benefits

**Framework Independence**: Core logic has zero framework dependencies, enabling use in any JavaScript environment.

**Modular Design**: Separate hooks for client management, encryption, and decryption provide better composability and testing.

**Single Dependency**: Developers install one package; the SDK manages all internal dependencies.

**Type Safety**: Full TypeScript support with comprehensive type definitions.

**Real Mock Implementation**: Uses `@fhevm/mock-utils` for authentic FHEVM operations on localhost.

---

## Usage Examples

### React

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm-sdk';

const { client } = useFhevmClient({ provider, chainId });
const { encryptU32 } = useEncrypt({ client, contractAddress, userAddress });
const { userDecrypt } = useDecrypt({ client, signer });
```

### Node.js

```typescript
import { FhevmClient } from '@fhevm-sdk/core';

const client = await FhevmClient.create({ provider, chainId });
const encrypted = await client.encryptU32(42, contractAddress, userAddress);
const result = await client.userDecrypt([{ handle, contractAddress }], signer);
```

### Vue.js

```typescript
import { FhevmClient } from '@fhevm-sdk/core';
import { ref, onMounted } from 'vue';

const client = ref(null);
onMounted(async () => {
  client.value = await FhevmClient.create({ provider, chainId });
});
```

---

## Technical Implementation

### Framework-Agnostic Core

The core layer contains zero framework dependencies, verified by examining imports:

```bash
$ grep -r "import.*react" packages/fhevm-sdk/src/core/
# No matches found
```

This design enables genuine reusability across any JavaScript environment.

### FHEVM Mock Implementation

The SDK uses `@fhevm/mock-utils` for authentic FHEVM operations on localhost:

```typescript
// Dynamic import prevents bundle bloat in production
const fhevmMock = await import("./mock/fhevmMock.js");
const instance = await fhevmMock.fhevmMockCreateInstance({
  rpcUrl,
  chainId,
  metadata: hardhatMetadata
});
```

Benefits include real encryption/decryption on localhost, identical API to production, and no bundle size impact.

### API Design

The SDK follows wagmi-like patterns familiar to web3 developers:

```typescript
// Client lifecycle
const { client, status, error } = useFhevmClient({ provider, chainId });

// Encryption operations
const { encryptU32, canEncrypt } = useEncrypt({ client, contractAddress, userAddress });

// Decryption operations
const { userDecrypt, isDecrypting } = useDecrypt({ client, signer });
```

### Network Detection

The SDK automatically switches between localhost mock and production relayer based on chain ID, requiring zero configuration from developers.

### Signature Caching

EIP-712 signatures are cached after the first decrypt operation, making subsequent decryptions instant.

---

## Architecture Benefits

### Layered Design

```
Core Layer (Framework-agnostic)
    ↓
Adapter Layer (React, Vue, etc.)
    ↓
Application Layer (dApp)
```

This separation provides improved testability, extensibility, maintainability, and future-proofing.

### Dependency Management

Developers install a single package:

```bash
npm install @fhevm-sdk
```

The SDK internally manages all required dependencies including `@zama-fhe/relayer-sdk`, `ethers`, `idb`, and `@fhevm/mock-utils`.

### Modular Exports

```typescript
// Full SDK
import { FhevmClient, useFhevmClient } from '@fhevm-sdk';

// Core only (Node.js)
import { FhevmClient } from '@fhevm-sdk/core';

// React hooks
import { useFhevmClient, useEncrypt } from '@fhevm-sdk/react';

// Type definitions
import type { FhevmConfig, EncryptedInput } from '@fhevm-sdk/types';
```

### Type Safety

The SDK provides comprehensive TypeScript definitions:

```typescript
interface FhevmConfig {
  provider: string | Eip1193Provider;
  chainId?: number;
  signal?: AbortSignal;
  onStatusChange?: (status: FhevmStatus) => void;
}

type FhevmStatus = 
  | "idle" | "sdk-loading" | "sdk-loaded" 
  | "sdk-initializing" | "sdk-initialized" 
  | "creating" | "ready" | "error";
```

---

## Testing

The SDK includes a comprehensive test suite:

```
test/
├── unit/              # Type validation, error handling
├── integration/       # Core client, encryption, decryption, React hooks
├── e2e/              # Full workflows
└── helpers/          # Test utilities
```

All tests pass with coverage across core functionality, React hooks, and end-to-end workflows.

### Code Quality

- TypeScript strict mode enabled
- ESLint and Prettier configured
- JSDoc comments on public APIs
- Comprehensive error handling
- Production-ready code

---

## Documentation

The project includes complete documentation:

1. **README.md** - Project overview and quick start
2. **API.md** - Complete API reference
3. **QUICK_START.md** - Getting started guide
4. **DEVELOPMENT_GUIDE.md** - Development workflow
5. **SEPOLIA_SETUP_GUIDE.md** - Testnet deployment
6. **CONTRIBUTING.md** - Contribution guidelines
7. **CHANGELOG.md** - Version history
8. **docs/guides/** - Migration and troubleshooting guides

Examples are provided for React (Next.js showcase) and Node.js (framework-agnostic usage).

---

## Network Support

### Localhost Development

```typescript
const client = await FhevmClient.create({
  provider: "http://localhost:8545",
  chainId: 31337,
  mockChains: { 31337: "http://localhost:8545" }
});
```

Uses `@fhevm/mock-utils` for authentic FHEVM operations with automatic detection and identical API to production.

### Sepolia Testnet

```typescript
const client = await FhevmClient.create({
  provider: "https://sepolia.infura.io/v3/YOUR_KEY",
  chainId: 11155111
});
```

Uses production Relayer SDK with real FHEVM operations and EIP-712 signatures.

---

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start Hardhat node (Terminal 1)
pnpm chain

# Deploy contracts (Terminal 2)
pnpm deploy:localhost

# Start Next.js app (Terminal 3)
pnpm start
```

> **Using npx**: If pnpm is not installed globally, prefix commands with `npx`:
> ```bash
> npx pnpm install
> npx pnpm chain
> npx pnpm deploy:localhost
> npx pnpm start
> ```

Visit `http://localhost:3000` to see the demo.

### Basic Usage

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm-sdk';

function MyComponent() {
  const { client } = useFhevmClient({ provider, chainId });
  const { encryptU32 } = useEncrypt({ client, contractAddress, userAddress });
  const { userDecrypt } = useDecrypt({ client, signer });
  
  const encrypted = await encryptU32(42);
  const result = await userDecrypt([{ handle, contractAddress }]);
}
```

---

## Summary

This implementation provides a framework-agnostic FHEVM SDK with the following characteristics:

- **Architecture**: Layered design with framework-independent core
- **API**: Wagmi-like patterns familiar to web3 developers
- **Dependencies**: Single package installation
- **Networks**: Support for localhost (mock) and Sepolia (production)
- **Type Safety**: Comprehensive TypeScript definitions
- **Testing**: Full test coverage across unit, integration, and e2e scenarios
- **Documentation**: Complete guides and API reference

The SDK enables developers to build confidential dApps with minimal code in any JavaScript environment.

---

**Repository**: https://github.com/v1ktorrr0x/fhevm-react-template  
**License**: MIT
