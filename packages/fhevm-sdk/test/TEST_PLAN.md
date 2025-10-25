# FHEVM SDK Test Plan

## Overview

Comprehensive testing strategy for the Universal FHEVM SDK covering unit, integration, and end-to-end tests.

## Test Structure

```
test/
├── unit/                      # Unit tests for individual functions
│   ├── error-handling.test.ts
│   └── type-validation.test.ts
├── integration/               # Integration tests for SDK components
│   ├── core-client.test.ts
│   ├── encryption-flow.test.ts
│   ├── decryption-flow.test.ts
│   ├── mock-network.test.ts
│   └── react-hooks.test.ts
├── e2e/                       # End-to-end tests for complete flows
│   ├── e2e-counter.test.ts
│   ├── e2e-network-switch.test.ts
│   └── e2e-error-handling.test.ts
└── helpers/                   # Test utilities and mocks
    ├── test-utils.ts
    └── mock-contracts.ts
```

## Test Categories

### Unit Tests
- Individual function testing
- Type validation
- Error handling utilities
- Pure logic without dependencies

### Integration Tests
- Component interaction
- SDK initialization
- Encryption/decryption flows
- React hooks behavior
- Mock network support

### End-to-End Tests
- Complete user workflows
- Contract interaction flows
- Network switching scenarios
- Error recovery mechanisms

## Coverage Goals

- **Overall**: >80% code coverage
- **Core logic**: >90% coverage
- **React hooks**: >85% coverage
- **Error handling**: 100% coverage

## Running Tests

```bash
# Run all tests
pnpm sdk:test

# Run specific test category
pnpm vitest test/unit
pnpm vitest test/integration
pnpm vitest test/e2e

# Run with coverage
pnpm sdk:test

# Watch mode
pnpm sdk:test:watch

# Run specific file
pnpm vitest test/integration/core-client.test.ts
```

## Test Implementation Priority

### Phase 1: Core Tests (Week 1)
1. Unit tests for error handling
2. Unit tests for type validation
3. Integration tests for core client
4. Integration tests for encryption flow

### Phase 2: React Tests (Week 1-2)
1. Integration tests for React hooks
2. Integration tests for providers
3. Hook lifecycle tests

### Phase 3: E2E Tests (Week 2)
1. E2E counter flow
2. E2E network switching
3. E2E error handling

### Phase 4: Mock Tests (Week 2)
1. Mock network detection
2. Mock instance creation
3. Mock contract interaction

## Manual Testing Checklist

### Next.js Showcase
- [ ] App loads without errors
- [ ] Wallet connection works
- [ ] Counter increment works
- [ ] Counter decrement works
- [ ] Decryption works
- [ ] Network switching works
- [ ] Error messages are clear
- [ ] Loading states are correct

### Node.js Example
- [ ] Script runs without errors
- [ ] Encryption works
- [ ] Contract call works
- [ ] Decryption works

### Vue Example (if implemented)
- [ ] App loads without errors
- [ ] Composables work correctly
- [ ] State management works

## Test Data

### Mock Addresses
- Counter Contract: `0xCounter123456789012345678901234567890`
- ACL Contract: `0xACL1234567890123456789012345678901234`
- Test Account: `0x1234567890123456789012345678901234567890`

### Mock Chain IDs
- Localhost: `31337`
- Sepolia: `11155111`

### Mock Values
- Public Key: `mock-public-key`
- Public Params: `mock-public-params`
- Encrypted Handle: `0x1234`

## Continuous Integration

Tests should run on:
- Every commit
- Every pull request
- Before deployment

## Test Maintenance

- Update tests when API changes
- Add tests for new features
- Remove tests for deprecated features
- Keep test data up to date
- Review coverage reports regularly
