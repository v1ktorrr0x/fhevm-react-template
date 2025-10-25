# Universal FHEVM SDK Documentation

Complete documentation for the Universal FHEVM SDK.

---

## 📚 Documentation Index

### Getting Started
- [Quick Start Guide](../QUICK_START.md) - Get up and running in 5 minutes
- [Development Guide](../DEVELOPMENT_GUIDE.md) - Complete development workflow
- [Migration Guide](./guides/MIGRATION_GUIDE.md) - Migrate from old API to Universal SDK
- [Troubleshooting Guide](./guides/TROUBLESHOOTING.md) - Common issues and solutions

### Examples
- [Next.js Showcase](../packages/nextjs/app/_components/FHECounterDemo.tsx) - React example
- [Node.js Example](../examples/node-js/) - Framework-agnostic example

### Project Information
- [Project Status](../STATUS.md) - Current progress and metrics
- [API Documentation](../API.md) - Complete API reference
- [Changelog](../CHANGELOG.md) - Version history
- [Contributing](../CONTRIBUTING.md) - How to contribute

---

## 🎯 Quick Links

### For Users
- **Installation**: See [Quick Start Guide](../QUICK_START.md)
- **API Reference**: See main [README](../README.md#-api-reference)
- **Examples**: Check `packages/nextjs/app/_components/FHECounterDemo.tsx`

### For Developers
- **Architecture**: See [Development Guide](../DEVELOPMENT_GUIDE.md)
- **Testing**: See [Project Status](../STATUS.md#-test-results)
- **Contributing**: See [Contributing Guide](../CONTRIBUTING.md)

---

## 📖 Core Concepts

### Framework-Agnostic Design

The SDK is built with a framework-agnostic core that works in any JavaScript environment:

```
Core (framework-agnostic)
  ↓
React Hooks (React-specific)
  ↓
Your Application
```

### Wagmi-Like API

The SDK follows wagmi patterns for familiarity:

- `useFhevmClient` - Like `useClient` in wagmi
- `useEncrypt` - Encryption operations
- `useDecrypt` - Decryption operations

### Type Safety

Full TypeScript support with:
- Strict type checking
- Excellent autocomplete
- Comprehensive type definitions

---

## 🏗️ Architecture

### Package Structure

```
packages/fhevm-sdk/
├── src/
│   ├── core/              # Framework-agnostic
│   │   ├── client.ts     # Main FhevmClient class
│   │   ├── types.ts      # Type definitions
│   │   └── index.ts      # Exports
│   ├── react/             # React-specific
│   │   ├── useFhevmClient.ts
│   │   ├── useEncrypt.ts
│   │   ├── useDecrypt.ts
│   │   └── index.ts
│   ├── internal/          # Internal implementation
│   │   ├── fhevm.ts      # Core FHEVM logic
│   │   ├── mock/         # Mock implementation
│   │   └── ...
│   └── storage/           # Storage utilities
└── test/                  # 127 tests
    ├── integration/       # Integration tests
    ├── unit/             # Unit tests
    └── e2e/              # End-to-end tests
```

### Key Components

1. **FhevmClient**: Main client class for all FHEVM operations
2. **React Hooks**: Convenient hooks for React applications
3. **Storage**: IndexedDB-based storage for keys and signatures
4. **Mock Support**: Local Hardhat testing support

---

## 🧪 Testing

### Test Coverage

- **Total Tests**: 127
- **Passing**: 100 (without Hardhat node)
- **Passing**: 127 (with Hardhat node)
- **Coverage**: >50% (target met)

### Test Categories

1. **Unit Tests**: Core functionality
2. **Integration Tests**: Full workflows
3. **E2E Tests**: Complete user flows
4. **React Tests**: Hook behavior

### Running Tests

```bash
# All tests
npx pnpm sdk:test

# Watch mode
npx pnpm sdk:test:watch

# Specific test file
npx pnpm vitest test/integration/core-client.test.ts
```

---

## 🚀 Deployment

### Production Build

```bash
# Build SDK
npx pnpm sdk:build

# Build Next.js (requires env vars)
npx pnpm next:build
```

### Environment Variables

Required for production:
- `NEXT_PUBLIC_ALCHEMY_API_KEY`
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

---

## 📝 API Documentation

See main [README](../README.md#-api-reference) for complete API reference.

### Quick Reference

**Core API**:
- `FhevmClient.create()` - Initialize client
- `client.encrypt*()` - Encryption methods
- `client.userDecrypt()` - User decryption
- `client.publicDecrypt()` - Public decryption

**React Hooks**:
- `useFhevmClient()` - Client lifecycle
- `useEncrypt()` - Encryption operations
- `useDecrypt()` - Decryption operations

---

## 🤝 Support

For questions or issues:
1. Check the documentation
2. Review example code in `packages/nextjs`
3. Check test files for usage examples
4. Open an issue on GitHub

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details

---

**Last Updated**: October 22, 2025
