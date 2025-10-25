# Project Structure

## Monorepo Organization

This is a pnpm workspace monorepo with three main packages:

```
fhevm-react-template/
├── packages/
│   ├── fhevm-sdk/              # FHEVM SDK package
│   ├── hardhat/                # Smart contracts (git submodule)
│   └── nextjs/                 # React frontend application
├── scripts/
│   └── generateTsAbis.ts       # Contract ABI generator
├── .kiro/                      # Kiro configuration
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # Workspace definition
└── tsconfig.json               # Root TypeScript config
```

## Package Details

### packages/fhevm-sdk
Custom SDK for FHEVM integration with modular exports:
- `src/core/` - Core FHEVM functionality
- `src/storage/` - Storage utilities (IndexedDB)
- `src/react/` - React-specific hooks and components
- `src/fhevmTypes.ts` - Type definitions
- `dist/` - Compiled output (ESM)
- `test/` - Vitest test files

### packages/hardhat
Smart contract development (git submodule: fhevm-hardhat-template):
- Contains FHEVM smart contracts
- Deployment scripts for localhost and Sepolia
- Generates deployment artifacts in `deployments/` directory
- Artifacts used by `generateTsAbis.ts` script

### packages/nextjs
Next.js frontend application:
- `app/` - Next.js app router pages
- `components/` - React components
- `hooks/` - Custom React hooks
  - `hooks/fhecounter-example/` - FHEVM contract interaction examples
  - `hooks/helper/` - Wallet provider hooks (MetaMask, EIP-6963)
- `contracts/` - Generated contract ABIs and types
  - `deployedContracts.ts` - Auto-generated from Hardhat deployments
- `services/` - Business logic and API services
- `utils/` - Utility functions
- `types/` - TypeScript type definitions
- `styles/` - Global styles and Tailwind config
- `public/` - Static assets
- `scaffold.config.ts` - Application configuration

## Key Files

- `scripts/generateTsAbis.ts` - Generates TypeScript contract definitions from Hardhat deployments
- `.gitmodules` - Git submodule configuration for hardhat package
- Root `package.json` - Defines all workspace scripts and dependencies

## Build Flow

1. `pnpm install` triggers `preinstall` → builds SDK
2. Deploy contracts with `pnpm deploy:localhost` or `pnpm deploy:sepolia`
3. `pnpm generate` creates `packages/nextjs/contracts/deployedContracts.ts` from deployment artifacts
4. Next.js app imports generated contracts for type-safe contract interactions

## Important Conventions

- SDK is a workspace dependency (`@fhevm-sdk: workspace:*`)
- Contract ABIs are auto-generated - do not manually edit `deployedContracts.ts`
- Hardhat package is a git submodule - update with `git submodule update`
- All workspace scripts are prefixed by package name (e.g., `next:`, `hardhat:`, `sdk:`)
