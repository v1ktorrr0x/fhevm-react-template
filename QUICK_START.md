# Quick Start Guide

## Setup (4 Commands)

```bash
pnpm install              # Install + build SDK
pnpm chain                # Terminal 1: Start Hardhat
pnpm deploy:localhost     # Terminal 2: Deploy contracts
pnpm start                # Terminal 3: Start Next.js
```

**Using npx** (if pnpm not installed globally):
```bash
npx pnpm install
npx pnpm chain
npx pnpm deploy:localhost
npx pnpm start
```

Visit `http://localhost:3000` 🚀

## SDK Usage (3 Lines!)

```typescript
const { client } = useFhevmClient({ provider, chainId });
const encrypted = await client.encryptU32(42, contractAddress, userAddress);
const result = await client.userDecrypt([{ handle, contractAddress }], signer);
```

## Troubleshooting

- **App not loading?** Check Hardhat is running, contracts deployed
- **Wallet issues?** Add localhost network (chainId: 31337)
- **Need help?** See `PROJECT_REFERENCE.md`
