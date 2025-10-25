# Development Guide - Getting Started

## Current Status ✅

- ✅ Dependencies installed (1,572 packages)
- ✅ SDK built successfully
- ✅ Hardhat submodule initialized
- ✅ Test infrastructure ready (135 tests passing)
- ✅ **Base app fully tested and working**
- ✅ **Ready for Phase 1 development**

## Quick Start - Run the Existing App

Follow these steps to get the base app running:

### Step 1: Start Local Hardhat Node

Open **Terminal 1** and run:
```bash
npx pnpm chain
```

This will:
- Start a local Hardhat node on http://127.0.0.1:8545
- Chain ID: 31337
- Keep this terminal running

### Step 2: Deploy Contracts

Open **Terminal 2** and run:
```bash
npx pnpm deploy:localhost
```

This will:
- Deploy FHECounter contract to localhost
- Generate TypeScript ABIs
- Create `packages/nextjs/contracts/deployedContracts.ts`

### Step 3: Start Next.js Frontend

Open **Terminal 3** and run:
```bash
npx pnpm start
```

This will:
- Start Next.js dev server on http://localhost:3000
- Hot reload enabled

### Step 4: Connect MetaMask

1. Open http://localhost:3000 in your browser
2. Click "Connect Wallet"
3. Add Hardhat network to MetaMask:
   - Network Name: **Hardhat Local**
   - RPC URL: **http://127.0.0.1:8545**
   - Chain ID: **31337**
   - Currency Symbol: **ETH**

### Step 5: Test the App

Try these actions:
- ✅ Connect wallet
- ✅ Increment counter
- ✅ Decrement counter
- ✅ Decrypt counter value

## Troubleshooting

### Issue: "Nonce too high" error in MetaMask
**Solution**: Clear MetaMask activity
1. MetaMask → Settings → Advanced
2. Click "Clear activity tab data"
3. Restart browser

### Issue: "Cached view function results"
**Solution**: Restart browser completely (not just refresh)

### Issue: Port already in use
**Solution**: 
```bash
# Find and kill process on port 8545
netstat -ano | findstr :8545
taskkill /PID <PID> /F

# Or use different port in hardhat config
```

## Next Steps - After App is Running

Once you verify the base app works:

1. **Explore the code** - Understand current implementation
2. **Plan refactoring** - Identify what needs to change
3. **Implement Phase 1** - Create framework-agnostic core
4. **Test continuously** - Run tests after each change
5. **Document changes** - Update README as you go

## Development Workflow

### Daily Development Loop:
```bash
# 1. Make changes to SDK
# 2. Rebuild SDK
npx pnpm sdk:build

# 3. Run tests
npx pnpm sdk:test

# 4. Check Next.js still works
npx pnpm start

# 5. Commit when tests pass
git add .
git commit -m "feat: add feature X"
```

### Before Each Commit:
```bash
npx pnpm lint          # Check code style
npx pnpm sdk:test      # Run SDK tests
npx pnpm format        # Format code
```

### Testing Specific Areas:
```bash
# Test SDK only
npx pnpm sdk:test

# Test specific file
npx pnpm vitest packages/fhevm-sdk/test/integration/core-client.test.ts

# Watch mode (auto-rerun on changes)
npx pnpm sdk:test:watch
```

## Project Structure Reminder

```
fhevm-react-template/
├── packages/
│   ├── fhevm-sdk/           # Your main focus - SDK refactoring
│   ├── hardhat/             # Smart contracts (git submodule)
│   └── nextjs/              # Showcase app (update after SDK changes)
├── .kiro/steering/          # Your development guides
└── DEVELOPMENT_GUIDE.md     # This file
```

## Key Files to Know

### SDK Files:
- `packages/fhevm-sdk/src/index.ts` - Main exports
- `packages/fhevm-sdk/src/core/` - Core logic (your focus)
- `packages/fhevm-sdk/src/react/` - React hooks
- `packages/fhevm-sdk/package.json` - Dependencies

### Next.js Files:
- `packages/nextjs/app/_components/FHECounterDemo.tsx` - Main demo
- `packages/nextjs/hooks/fhecounter-example/` - Example hooks
- `packages/nextjs/contracts/deployedContracts.ts` - Generated ABIs

### Test Files:
- `packages/fhevm-sdk/test/integration/` - Integration tests
- `packages/fhevm-sdk/test/e2e/` - End-to-end tests
- `packages/fhevm-sdk/test/unit/` - Unit tests

## Tips for Success

1. **Start Small** - Get base app running first ✅
2. **Test Often** - Run tests after every change
3. **Commit Frequently** - Small, working commits
4. **Document As You Go** - Update docs while code is fresh
5. **Ask for Help** - Check Discord, GitHub issues
6. **Focus on Core** - SDK quality > number of examples
7. **Ship Early** - Working version 3 days before deadline

## Resources

- [FHEVM Docs](https://docs.zama.ai/protocol/solidity-guides/)
- [Architecture Details](./BOUNTY_SUBMISSION.md)

---

**Current Phase**: Getting base app running
**Next Phase**: Phase 1 - Create framework-agnostic core
**Timeline**: 3 weeks until submission (Oct 31, 2025)
