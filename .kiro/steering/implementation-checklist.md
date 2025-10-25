# Implementation Checklist

**Status**: Base app verified ✅ | Ready for Phase 1 🚀  
**Updated**: October 21, 2025

## Phase 1: Framework-Agnostic Core (Week 1)

### Day 1: Analysis & Design ⏳
- [ ] Read `packages/fhevm-sdk/src/internal/fhevm.ts` (understand createFhevmInstance)
- [ ] Read `packages/fhevm-sdk/src/react/useFhevm.tsx` (understand React coupling)
- [ ] Read `packages/fhevm-sdk/src/react/useFHEEncryption.ts` (understand encryption)
- [ ] Read `packages/fhevm-sdk/src/react/useFHEDecrypt.ts` (understand decryption)
- [ ] Document current architecture in notes
- [ ] Design `FhevmClient` class API
- [ ] Create `packages/fhevm-sdk/DESIGN.md` with proposed API
- [ ] Review design against bounty requirements

### Day 2: Dependencies & Core Structure
- [ ] Update `packages/fhevm-sdk/package.json`:
  - [ ] Move `@zama-fhe/relayer-sdk` from peerDeps to deps
  - [ ] Move `ethers` from peerDeps to deps
  - [ ] Keep only `react` as peerDep
- [ ] Run `npx pnpm install` to update dependencies
- [ ] Create `packages/fhevm-sdk/src/core/client.ts`
- [ ] Create `packages/fhevm-sdk/src/core/types.ts`
- [ ] Define `FhevmConfig` interface
- [ ] Define `FhevmClient` class skeleton
- [ ] Export from `packages/fhevm-sdk/src/core/index.ts`
- [ ] Build SDK: `npx pnpm sdk:build`
- [ ] Verify no build errors

### Day 3: Core Client Implementation
- [ ] Implement `FhevmClient.create()` method
- [ ] Extract logic from `createFhevmInstance` in `internal/fhevm.ts`
- [ ] Make initialization framework-agnostic
- [ ] Implement `isReady()` method
- [ ] Implement `getPublicKey()` method
- [ ] Write test in `test/integration/core-client.test.ts`
- [ ] Run test: `npx pnpm vitest test/integration/core-client.test.ts`
- [ ] Make test pass
- [ ] Verify Next.js still works: `npx pnpm start`

### Day 4: Encryption Implementation
- [ ] Create `packages/fhevm-sdk/src/core/encryption.ts`
- [ ] Implement `encrypt()` method
- [ ] Implement `encryptBool()` method
- [ ] Implement `encryptU8()` method
- [ ] Implement `encryptU16()` method
- [ ] Implement `encryptU32()` method
- [ ] Add encryption methods to `FhevmClient`
- [ ] Write tests in `test/integration/encryption-flow.test.ts`
- [ ] Run tests: `npx pnpm sdk:test`
- [ ] Verify >50% coverage on encryption

### Day 5: Decryption Implementation
- [ ] Create `packages/fhevm-sdk/src/core/decryption.ts`
- [ ] Implement `userDecrypt()` method (with EIP-712)
- [ ] Implement `publicDecrypt()` method
- [ ] Add decryption methods to `FhevmClient`
- [ ] Write tests in `test/integration/decryption-flow.test.ts`
- [ ] Run tests: `npx pnpm sdk:test`
- [ ] Verify >50% coverage on decryption

### Day 6: React Hooks Refactoring
- [ ] Create `packages/fhevm-sdk/src/react/useFhevmClient.ts`
- [ ] Implement hook using `FhevmClient`
- [ ] Create `packages/fhevm-sdk/src/react/useEncrypt.ts`
- [ ] Create `packages/fhevm-sdk/src/react/useDecrypt.ts`
- [ ] Add deprecation warning to old `useFhevm.tsx`
- [ ] Keep old hooks working (backward compatibility)
- [ ] Write tests in `test/integration/react-hooks.test.ts`
- [ ] Run tests: `npx pnpm sdk:test`

### Day 7: Week 1 Review & Cleanup
- [ ] Run all tests: `npx pnpm sdk:test`
- [ ] Check coverage: Open `coverage/index.html`
- [ ] Verify >50% overall coverage
- [ ] Run lint: `npx pnpm lint`
- [ ] Run format: `npx pnpm format`
- [ ] Test Next.js app still works
- [ ] Update documentation with progress
- [ ] Commit all changes
- [ ] Review Week 1 goals vs actual progress

## Phase 2: Examples & Integration (Week 2)

### Day 8-9: Next.js Showcase Update
- [ ] Update `FHECounterDemo.tsx` to use new hooks
- [ ] Create example component with new API
- [ ] Keep old example for comparison
- [ ] Test all functionality works
- [ ] Update README with new usage examples
- [ ] Deploy to Vercel or similar
- [ ] Add deployment link to README

### Day 10-11: Node.js Example
- [ ] Create `examples/node-js/` directory
- [ ] Create `package.json` for Node.js example
- [ ] Write simple script using `FhevmClient`
- [ ] Show: initialize → encrypt → call contract → decrypt
- [ ] Add README with instructions
- [ ] Test example works: `node index.js`
- [ ] Document in main README

### Day 12-13: Vue Example (Optional)
- [ ] Create `examples/vue/` directory
- [ ] Set up Vue 3 project
- [ ] Create Vue composable wrapping `FhevmClient`
- [ ] Create simple counter component
- [ ] Add README with instructions
- [ ] Test example works
- [ ] Document in main README

### Day 14: Week 2 Review
- [ ] Run all tests: `npx pnpm sdk:test`
- [ ] Verify >70% coverage
- [ ] Test all examples work
- [ ] Update documentation
- [ ] Commit all changes

## Phase 3: Documentation & Polish (Week 3)

### Day 15-16: Documentation
- [ ] Write comprehensive README
- [ ] Add quick start guide
- [ ] Add API reference
- [ ] Add migration guide from old API
- [ ] Create `docs/` directory with detailed guides
- [ ] Add troubleshooting section
- [ ] Add FAQ section

### Day 17-18: Code Quality
- [ ] Add JSDoc comments to all public APIs
- [ ] Improve error messages
- [ ] Add error codes
- [ ] Add documentation links in errors
- [ ] Run lint and fix all issues
- [ ] Run format on all files
- [ ] Check TypeScript strict mode compliance

### Day 19: Video Walkthrough
- [ ] Plan video content (5-10 minutes)
- [ ] Record: Installation process
- [ ] Record: Basic setup (<10 lines demo)
- [ ] Record: Key design decisions
- [ ] Record: Architecture explanation
- [ ] Record: Live demo of encryption/decryption
- [ ] Record: Multiple framework showcase (if applicable)
- [ ] Edit video
- [ ] Upload to YouTube
- [ ] Add link to README

### Day 20: Final Testing
- [ ] Run all tests: `npx pnpm sdk:test`
- [ ] Verify >80% coverage
- [ ] Test Next.js showcase
- [ ] Test Node.js example
- [ ] Test Vue example (if created)
- [ ] Test fresh install: `npx pnpm install`
- [ ] Test production build: `npx pnpm next:build`
- [ ] Check for console errors
- [ ] Verify all links work

### Day 21: Submission Preparation
- [ ] Final code review
- [ ] Update all documentation
- [ ] Verify all deliverables:
  - [ ] GitHub repo (fork with history)
  - [ ] Next.js showcase deployed
  - [ ] Video walkthrough uploaded
  - [ ] README complete
  - [ ] Examples working
- [ ] Create submission checklist
- [ ] Prepare submission materials

## Continuous Tasks (Throughout)

### Daily
- [ ] Run tests after each change
- [ ] Commit working code frequently
- [ ] Update documentation as you go
- [ ] Verify Next.js app still works

### Weekly
- [ ] Review progress vs timeline
- [ ] Adjust priorities if needed
- [ ] Update PROJECT_STATUS.md
- [ ] Check coverage reports

### Before Each Commit
- [ ] Run: `npx pnpm sdk:build`
- [ ] Run: `npx pnpm sdk:test`
- [ ] Run: `npx pnpm lint`
- [ ] Verify: Next.js app works

## Success Criteria

### Week 1 Complete When:
- [ ] `FhevmClient` class working
- [ ] Framework-agnostic core implemented
- [ ] Encryption/decryption working
- [ ] React hooks refactored
- [ ] Tests passing (>50% coverage)
- [ ] Next.js app still works

### Week 2 Complete When:
- [ ] Next.js showcase updated
- [ ] Node.js example working
- [ ] Vue example working (optional)
- [ ] Integration tests complete
- [ ] Tests passing (>70% coverage)

### Week 3 Complete When:
- [ ] Documentation complete
- [ ] JSDoc comments added
- [ ] Video recorded and uploaded
- [ ] Showcase deployed
- [ ] Tests passing (>80% coverage)
- [ ] Ready to submit

## Submission Checklist

### Required Deliverables
- [ ] GitHub repo (fork with commit history preserved)
- [ ] Next.js showcase deployed and linked
- [ ] Video walkthrough recorded and linked
- [ ] Comprehensive README
- [ ] API documentation
- [ ] Working examples

### Code Quality
- [ ] All tests passing
- [ ] >80% test coverage
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Code formatted
- [ ] JSDoc comments on public APIs

### Documentation
- [ ] README with quick start
- [ ] API reference
- [ ] Migration guide
- [ ] Troubleshooting section
- [ ] Examples for common use cases
- [ ] Video walkthrough

### Functionality
- [ ] Framework-agnostic core works
- [ ] Wagmi-like API implemented
- [ ] All encryption/decryption flows work
- [ ] Next.js showcase works
- [ ] Node.js example works
- [ ] No breaking changes to existing code

## Notes

- Target completion: October 28 (3-day buffer)
- Deadline: October 31, 2025 (23:59 AOE)
- Focus: 70% SDK, 20% showcase, 10% docs
- Priority: Core quality > number of examples
- Strategy: Test continuously, commit frequently
