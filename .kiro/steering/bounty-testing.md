# Testing Strategy for Universal FHEVM SDK

## Test Structure Created

A comprehensive test suite has been set up in `packages/fhevm-sdk/test/`:

```
test/
├── unit/                           # Unit tests
│   ├── error-handling.test.ts      # Error utilities
│   └── type-validation.test.ts     # Type validation
├── integration/                    # Integration tests
│   ├── core-client.test.ts         # FhevmClient lifecycle
│   ├── encryption-flow.test.ts     # Encryption workflows
│   ├── decryption-flow.test.ts     # Decryption workflows
│   ├── mock-network.test.ts        # Mock Hardhat support
│   ├── react-hooks.test.ts         # React hooks integration
│   └── README.md                   # Integration test docs
├── e2e/                            # End-to-end tests
│   ├── e2e-counter.test.ts         # Full counter flow
│   ├── e2e-network-switch.test.ts  # Network switching
│   └── e2e-error-handling.test.ts  # Error scenarios
├── helpers/                        # Test utilities
│   ├── test-utils.ts               # Mock providers, utilities
│   └── mock-contracts.ts           # Mock contract helpers
├── exports.test.ts                 # Existing export tests
├── FhevmDecryptionSignature.test.ts # Existing signature tests
├── storage.test.ts                 # Existing storage tests
└── TEST_PLAN.md                    # Complete test plan
```

## Test Implementation Approach

### Phase 1: Skeleton Tests (DONE ✅)
All test files created with TODO placeholders. This allows:
- Clear test structure from day 1
- Easy tracking of what needs implementation
- Parallel development (implement feature → fill in test)

### Phase 2: Implement Tests (During Development)
As you build each feature, fill in the corresponding tests:

1. **Building FhevmClient?** → Fill in `integration/core-client.test.ts`
2. **Adding encryption?** → Fill in `integration/encryption-flow.test.ts`
3. **Creating React hooks?** → Fill in `integration/react-hooks.test.ts`
4. **Testing full flow?** → Fill in `e2e/e2e-counter.test.ts`

### Phase 3: Coverage & Polish (Week 3)
- Run coverage reports
- Fill gaps to reach >80% coverage
- Add edge case tests
- Performance tests

## Running Tests

```bash
# Run all tests
pnpm sdk:test

# Run specific category
pnpm vitest test/unit
pnpm vitest test/integration
pnpm vitest test/e2e

# Run specific file
pnpm vitest test/integration/core-client.test.ts

# Watch mode (during development)
pnpm sdk:test:watch

# Coverage report
pnpm sdk:test
# Opens coverage report in coverage/index.html
```

## Test-Driven Development Workflow

### When Building New Feature:

1. **Write test first** (or use existing skeleton)
```typescript
it("should encrypt uint32 values", async () => {
  const client = await FhevmClient.create(mockConfig);
  const encrypted = await client.encryptU32(42);
  
  expect(encrypted).toBeDefined();
  expect(encrypted.data).toBeTruthy();
  expect(encrypted.proof).toBeTruthy();
});
```

2. **Run test** (it will fail)
```bash
pnpm vitest test/integration/encryption-flow.test.ts
```

3. **Implement feature** until test passes

4. **Refactor** with confidence (tests catch regressions)

## Test Helpers Available

### Mock Provider
```typescript
import { createMockProvider } from "../helpers/test-utils";

const provider = createMockProvider(31337); // localhost
```

### Mock FHEVM Instance
```typescript
import { createMockFhevmInstance } from "../helpers/test-utils";

const instance = createMockFhevmInstance();
```

### Mock Contracts
```typescript
import { createMockFHECounter } from "../helpers/mock-contracts";

const counter = createMockFHECounter();
```

### Wait for Condition
```typescript
import { waitForCondition } from "../helpers/test-utils";

await waitForCondition(() => client.isReady(), 5000);
```

## Coverage Goals

| Component | Target | Priority |
|-----------|--------|----------|
| Core client | >90% | Critical |
| Encryption | >90% | Critical |
| Decryption | >90% | Critical |
| React hooks | >85% | High |
| Error handling | 100% | Critical |
| Storage | >80% | Medium |
| Overall | >80% | Required |

## Manual Testing Checklist

After implementing features, manually test:

### Next.js Showcase
```bash
pnpm chain          # Terminal 1
pnpm deploy:localhost  # Terminal 2
pnpm start          # Terminal 3
```

Then verify:
- [ ] App loads without console errors
- [ ] Wallet connects successfully
- [ ] Counter increments work
- [ ] Counter decrements work
- [ ] Decryption shows correct value
- [ ] Network switch works (if implemented)
- [ ] Error messages are helpful
- [ ] Loading states display correctly

### Node.js Example (when created)
```bash
cd examples/node-js
pnpm install
node index.js
```

Verify:
- [ ] Script completes without errors
- [ ] Encryption works
- [ ] Contract interaction works
- [ ] Decryption works

## Continuous Testing During Development

### After Each Code Change:
```bash
# Quick test of affected area
pnpm vitest test/integration/core-client.test.ts

# If all pass, run full suite
pnpm sdk:test
```

### Before Each Commit:
```bash
pnpm lint           # Check code style
pnpm sdk:test       # Run all tests
pnpm next:build     # Verify Next.js builds
```

### Before Submission:
```bash
pnpm test           # All tests
pnpm lint           # All linting
pnpm format         # Format code
pnpm next:build     # Production build
```

## Test Priorities by Week

### Week 1: Core Tests
- [ ] Unit tests for type validation
- [ ] Unit tests for error handling
- [ ] Integration tests for FhevmClient
- [ ] Integration tests for encryption
- [ ] Integration tests for decryption

### Week 2: React & E2E Tests
- [ ] Integration tests for React hooks
- [ ] E2E test for counter flow
- [ ] E2E test for network switching
- [ ] Integration tests for mock network

### Week 3: Coverage & Edge Cases
- [ ] Fill coverage gaps
- [ ] Add edge case tests
- [ ] Performance tests
- [ ] Error scenario tests

## Common Testing Patterns

### Testing Async Operations
```typescript
it("should handle async initialization", async () => {
  const promise = FhevmClient.create(config);
  
  // Test loading state
  expect(client.status).toBe("loading");
  
  const client = await promise;
  
  // Test ready state
  expect(client.status).toBe("ready");
  expect(client.isReady()).toBe(true);
});
```

### Testing Error Handling
```typescript
it("should throw helpful error for invalid config", async () => {
  await expect(
    FhevmClient.create({ provider: null })
  ).rejects.toThrow(/provider is required/i);
});
```

### Testing React Hooks
```typescript
it("should initialize on mount", async () => {
  const { result } = renderHook(() => 
    useFhevmClient({ provider, chainId })
  );
  
  expect(result.current.status).toBe("loading");
  
  await waitFor(() => {
    expect(result.current.status).toBe("ready");
  });
  
  expect(result.current.client).toBeDefined();
});
```

## Debugging Failed Tests

### Test Fails Unexpectedly:
1. Run test in isolation: `pnpm vitest test/path/to/test.test.ts`
2. Add console.logs to understand state
3. Check mock setup is correct
4. Verify test environment (jsdom, fake-indexeddb)

### Test Times Out:
1. Check for missing `await` keywords
2. Verify async operations complete
3. Increase timeout if needed: `it("test", async () => {...}, 10000)`

### Coverage Too Low:
1. Run coverage: `pnpm sdk:test`
2. Open `coverage/index.html` in browser
3. Find uncovered lines (red)
4. Add tests for those lines

## Benefits of This Test Structure

1. **Clear Organization** - Easy to find relevant tests
2. **Comprehensive Coverage** - Unit → Integration → E2E
3. **Parallel Development** - Tests guide implementation
4. **Confidence** - Catch regressions early
5. **Documentation** - Tests show how to use SDK
6. **Bounty Score** - Demonstrates quality and completeness

## Remember

- **Test as you build**, don't leave testing for the end
- **Use existing test helpers** to avoid duplication
- **Keep tests simple** - one concept per test
- **Test behavior, not implementation** - tests should survive refactoring
- **Coverage is a guide, not a goal** - 80% meaningful coverage > 100% shallow coverage
