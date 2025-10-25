# Technology Stack

## Build System

- **Package Manager**: pnpm (required)
- **Monorepo**: pnpm workspaces
- **Node Version**: >=20.0.0
- **TypeScript**: 5.8.2+ (ES2022 target, CommonJS module)

## Core Technologies

### Frontend (packages/nextjs)
- **Framework**: Next.js 15.2.3+ with React 19.0.0
- **Styling**: Tailwind CSS 4.1.3 + DaisyUI 5.0.9
- **Wallet Integration**: RainbowKit 2.2.8, Wagmi 2.16.4, Viem 2.34.0
- **State Management**: Zustand 5.0.0, TanStack Query 5.59.15
- **UI Components**: Heroicons, react-hot-toast

### Smart Contracts (packages/hardhat)
- **Framework**: Hardhat with hardhat-deploy
- **Deployment**: Supports localhost (Chain ID 31337) and Sepolia testnet
- **FHEVM Integration**: Uses fhevm-hardhat-template (git submodule)

### SDK (packages/fhevm-sdk)
- **Build**: TypeScript with ESM output
- **Testing**: Vitest with coverage
- **Dependencies**: @zama-fhe/relayer-sdk, ethers 6.13.4+, idb (IndexedDB)
- **Exports**: Core, storage, types, and React-specific modules

## Common Commands

### Development Workflow
```bash
# Install dependencies (builds SDK automatically)
pnpm install

# Start local Hardhat node
pnpm chain

# Deploy contracts to localhost
pnpm deploy:localhost

# Deploy contracts to Sepolia
pnpm deploy:sepolia

# Start Next.js dev server
pnpm start

# Generate TypeScript ABIs from deployed contracts
pnpm generate
```

### SDK Development
```bash
pnpm sdk:build        # Build SDK
pnpm sdk:watch        # Watch mode
pnpm sdk:test         # Run tests with coverage
pnpm sdk:test:watch   # Test watch mode
pnpm sdk:clean        # Clean dist folder
```

### Hardhat Operations
```bash
pnpm hardhat:compile  # Compile contracts
pnpm hardhat:test     # Run contract tests
pnpm hardhat:verify   # Verify contracts
pnpm hardhat:clean    # Clean artifacts
```

### Code Quality
```bash
pnpm lint             # Lint all packages
pnpm format           # Format code with Prettier
pnpm test             # Run all tests
```

## Important Notes

- The SDK must be built before other packages can use it (handled by `preinstall` hook)
- The `generate` script creates TypeScript contract definitions from Hardhat deployments
- Environment variables required: `MNEMONIC`, `INFURA_API_KEY` for Sepolia
- Production requires `NEXT_PUBLIC_ALCHEMY_API_KEY` in Next.js config
