# Universal FHEVM SDK

> **Framework-agnostic SDK for building confidential dApps with Fully Homomorphic Encryption on Ethereum**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-127%20passing-success.svg)]()

---

## 🎯 Why This SDK?

Build confidential dApps with **less than 10 lines of code** in any JavaScript environment:

```typescript
// React, Node.js, Vue, or any framework
const client = await FhevmClient.create({ provider, chainId });
const encrypted = await client.encryptU32(42, contractAddress, userAddress);
const result = await client.userDecrypt([{ handle, contractAddress }], signer);
```

### Key Features

- ✅ **True Framework-Agnostic** - Pure TypeScript core, zero React dependencies
- ✅ **Wagmi-Like API** - Familiar patterns for web3 developers
- ✅ **Single Dependency** - Just `@fhevm-sdk`, no complex setup
- ✅ **Real FHEVM Mock** - Actual encryption on localhost via `@fhevm/mock-utils`
- ✅ **Production Ready** - Works on Sepolia testnet
- ✅ **Type-Safe** - Full TypeScript support with auto-completion

## 🚀 Quick Start

### 1. Installation

```bash
pnpm install
```

### 2. Start Development Environment

```bash
# Terminal 1: Start Hardhat node
pnpm chain

# Terminal 2: Deploy contracts
pnpm deploy:localhost

# Terminal 3: Start Next.js showcase
pnpm start
```

Visit `http://localhost:3000` to see the live demo!

### 3. Use in Your Project

**React** (5 lines):
```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm-sdk';

const { client } = useFhevmClient({ provider, chainId });
const { encryptU32 } = useEncrypt({ client, contractAddress, userAddress });
const { userDecrypt } = useDecrypt({ client, signer });
```

**Node.js** (3 lines):
```typescript
import { FhevmClient } from '@fhevm-sdk/core';

const client = await FhevmClient.create({ provider, chainId });
const encrypted = await client.encryptU32(42, contractAddress, userAddress);
```

**Vue.js** (6 lines):
```typescript
import { FhevmClient } from '@fhevm-sdk/core';
import { ref, onMounted } from 'vue';

const client = ref(null);
onMounted(async () => {
  client.value = await FhevmClient.create({ provider, chainId });
});
```

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

## 📦 Project Structure

```
fhevm-react-template/
├── packages/
│   ├── fhevm-sdk/          # Universal FHEVM SDK
│   │   ├── src/
│   │   │   ├── core/       # Framework-agnostic core
│   │   │   ├── react/      # React hooks
│   │   │   ├── storage/    # IndexedDB utilities
│   │   │   └── internal/   # Internal implementation
│   │   └── test/           # Comprehensive tests
│   ├── hardhat/            # Smart contracts (FHEVM)
│   └── nextjs/             # Next.js showcase app
├── scripts/                # Utility scripts
└── docs/                   # Documentation
```

## 🛠️ Development

### SDK Development

```bash
# Build SDK
pnpm sdk:build

# Watch mode
pnpm sdk:watch

# Run tests
pnpm sdk:test

# Test with coverage
pnpm sdk:test
```

### Contract Development

```bash
# Compile contracts
pnpm hardhat:compile

# Test contracts
pnpm hardhat:test

# Deploy to localhost
pnpm deploy:localhost

# Deploy to Sepolia
pnpm deploy:sepolia
```

### Frontend Development

```bash
# Start dev server
pnpm start

# Build for production
pnpm next:build

# Generate TypeScript ABIs
pnpm generate
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [BOUNTY_SUBMISSION.md](./BOUNTY_SUBMISSION.md) | Architecture details and design approach |
| [QUICK_START.md](./QUICK_START.md) | Get started in 5 minutes |
| [API.md](./API.md) | Complete API reference |
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | Development workflow |
| [SEPOLIA_SETUP_GUIDE.md](./SEPOLIA_SETUP_GUIDE.md) | Deploy to Sepolia testnet |
| [docs/guides/MIGRATION_GUIDE.md](./docs/guides/MIGRATION_GUIDE.md) | Migrate from old API |
| [docs/guides/TROUBLESHOOTING.md](./docs/guides/TROUBLESHOOTING.md) | Common issues and solutions |

## 🧪 Testing

The SDK includes comprehensive tests:

```bash
# Run all tests
pnpm test

# Run SDK tests only
pnpm sdk:test

# Run with coverage
pnpm sdk:test
# Open coverage/index.html to view report
```

## 🌐 Supported Networks

- **Localhost** (Chain ID: 31337) - For development with FHEVM mock
- **Sepolia Testnet** (Chain ID: 11155111) - For testing with real FHEVM

## 🔑 Key Concepts

### Encryption
Encrypt values before sending to smart contracts:

```typescript
const encrypted = await encryptU32(42);
// Returns: { handles, inputProof }
```

### Decryption
Decrypt encrypted values with user permission:

```typescript
const result = await userDecrypt([
  { handle: '0x...', contractAddress: '0x...' }
]);
// User signs EIP-712 message to authorize decryption
```

### FHEVM Client
The core client manages encryption/decryption:

```typescript
const client = await FhevmClient.create({
  provider: window.ethereum,
  chainId: 31337,
});
```

## 🏗️ Architecture

### Framework-Agnostic Design

```
packages/fhevm-sdk/
├── src/core/          ✅ Zero framework dependencies (Node.js, browser, any JS)
├── src/react/         ✅ React adapter (hooks)
├── src/internal/      ✅ Implementation (network detection, mock)
└── src/storage/       ✅ Utilities (IndexedDB)
```

**Key Benefits**:
- Pure TypeScript core - no React coupling
- Wagmi-like modular API
- Real FHEVM mock for localhost
- Single dependency installation
- Full TypeScript support

See [BOUNTY_SUBMISSION.md](./BOUNTY_SUBMISSION.md) for detailed architecture information.

## 🧪 Testing

Comprehensive test suite with 127 passing tests:

```bash
pnpm sdk:test        # Run all tests with coverage
pnpm test            # Run all workspace tests
```

Test structure:
- **Unit tests**: Type validation, error handling
- **Integration tests**: Core client, encryption, decryption, React hooks
- **E2E tests**: Complete workflows

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- [Zama FHEVM](https://github.com/zama-ai/fhevm) - Fully Homomorphic Encryption
- [Hardhat](https://hardhat.org/) - Ethereum development
- [Wagmi](https://wagmi.sh/) - API design inspiration

---

**Universal FHEVM SDK** | [Architecture Details](./BOUNTY_SUBMISSION.md) | [Repository](https://github.com/v1ktorrr0x/fhevm-react-template)
