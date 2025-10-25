# Integration Tests

This directory contains integration tests that test the SDK as a whole, simulating real-world usage scenarios.

## Test Categories

### Core Integration Tests
- `core-client.test.ts` - Tests FhevmClient initialization and lifecycle
- `encryption-flow.test.ts` - Tests full encryption workflow
- `decryption-flow.test.ts` - Tests user and public decryption flows
- `mock-network.test.ts` - Tests SDK with mock Hardhat network

### React Integration Tests
- `react-hooks.test.ts` - Tests React hooks integration
- `react-provider.test.ts` - Tests React context providers
- `react-lifecycle.test.ts` - Tests component lifecycle with SDK

### End-to-End Tests
- `e2e-counter.test.ts` - Full counter contract interaction flow
- `e2e-network-switch.test.ts` - Tests network switching scenarios
- `e2e-error-handling.test.ts` - Tests error scenarios and recovery

## Running Tests

```bash
# Run all integration tests
pnpm sdk:test

# Run specific test file
pnpm vitest test/integration/core-client.test.ts

# Run in watch mode
pnpm sdk:test:watch

# Run with coverage
pnpm sdk:test
```

## Test Environment

- Uses `jsdom` for browser environment simulation
- Uses `fake-indexeddb` for IndexedDB mocking
- Mock FHEVM network for contract interactions
