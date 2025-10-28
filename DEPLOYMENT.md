# Deployment Guide

## Prerequisites

- Node.js 20.0.0 or higher
- pnpm package manager
- MetaMask or compatible Web3 wallet
- Testnet ETH (for Sepolia deployment)

## Installation

### Install Dependencies

```bash
pnpm install
```

## Local Development

### Start Local Environment

```bash
# Terminal 1: Start local blockchain
pnpm chain

# Terminal 2: Deploy contracts
pnpm deploy:localhost

# Terminal 3: Start frontend
pnpm start
```

Access the application at `http://localhost:3000`

## Network Configuration

### Supported Networks

| Network | Chain ID | RPC URL | Status |
|---------|----------|---------|--------|
| Localhost | 31337 | http://localhost:8545 | Supported |
| Sepolia | 11155111 | https://sepolia.infura.io | Supported |

## Deployment Procedures

### Localhost Deployment

```bash
# Start local node
pnpm chain

# Deploy contracts
pnpm deploy:localhost

# Start frontend
pnpm start
```

### Sepolia Testnet Deployment

#### 1. Acquire Testnet ETH
Visit [Sepolia Faucet](https://sepoliafaucet.com/) to request test ETH.

#### 2. Configure Environment
```bash
# packages/hardhat/.env
DEPLOYER_PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_rpc_url_here
```

#### 3. Deploy Contract
```bash
pnpm deploy:sepolia
```

#### 4. Verify Contract (Optional)
```bash
pnpm verify:sepolia
```

#### 5. Start Frontend
```bash
pnpm start
```

### Mainnet Deployment

**Note:** Mainnet deployment requires completion of security audit and comprehensive testing.

```bash
# Configure mainnet settings
# packages/hardhat/.env
DEPLOYER_PRIVATE_KEY=your_private_key_here
MAINNET_RPC_URL=your_rpc_url_here

# Deploy
pnpm deploy:mainnet

# Verify
pnpm verify:mainnet
```

## Post-Deployment Verification

### 1. Verify Deployment

```bash
# Check contract address
cat packages/nextjs/contracts/deployedContracts.ts

# Execute tests
pnpm hardhat:test
```

### 2. Verify Frontend Configuration

The frontend automatically detects deployed contracts from `deployedContracts.ts`.

### 3. Test Functionality

- Connect wallet
- Execute increment operation
- Execute decrement operation
- Execute decrypt operation
- Verify events in block explorer

## Configuration

### Smart Contract Configuration

Edit `packages/hardhat/contracts/FHECounter.sol`:

```solidity
constructor() {
    owner = msg.sender;
    _count = FHE.asEuint32(0);
    // Additional initialization
}
```

### Frontend Configuration

Edit `packages/nextjs/app/_components/FHECounterDemo.tsx`:

```typescript
// Configuration constants
const UI_UPDATE_DELAY = 50; // milliseconds
const BLOCKCHAIN_SETTLE_DELAY = 1500; // milliseconds
const SUCCESS_MESSAGE_DURATION = 3000; // milliseconds
```

## Troubleshooting

### Contract Deployment Issues

```bash
# Solution: Clean and recompile
pnpm hardhat:clean
pnpm hardhat:compile
pnpm deploy:localhost
```

### Frontend Connection Issues

```bash
# Solution: Regenerate contract types
pnpm generate
pnpm start
```

### FHEVM Client Initialization Issues

Verify network configuration and ensure correct chain ID and RPC URL.

## Production Build

### Build Frontend

```bash
# Build production version
pnpm next:build

# Serve production build
pnpm next:serve
```

### Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true pnpm next:build
```

## Monitoring

### Contract Events

Monitor contract events using block explorer or event listeners:

```typescript
contract.on('CounterIncremented', (user, timestamp) => {
  console.log(`Counter incremented by ${user} at ${timestamp}`);
});
```

## Security Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Private keys secured
- [ ] Contract compiled without warnings
- [ ] Tests executed successfully
- [ ] Gas costs reviewed
- [ ] Network configuration verified

### Post-Deployment
- [ ] Contract address verified
- [ ] Ownership transferred (if required)
- [ ] Event monitoring configured
- [ ] Deployment artifacts backed up
- [ ] Documentation updated

## Rollback Procedure

### Emergency Response

1. **Pause Contract**
   ```solidity
   await contract.pause();
   ```

2. **Deploy Updated Version**
   ```bash
   pnpm deploy:sepolia
   ```

3. **Update Frontend**
   ```bash
   pnpm generate
   pnpm start
   ```

4. **Notify Users**
   Update UI with migration notice and provide new contract address.

## Cost Estimates

### Deployment Costs

| Network | Deployment | Verification | Total |
|---------|-----------|--------------|-------|
| Localhost | Free | N/A | Free |
| Sepolia | ~$0.50 | Free | ~$0.50 |
| Mainnet | ~$500-1000 | ~$50 | ~$550-1050 |

### Operation Costs (Mainnet Estimates)

| Operation | Gas | Cost (50 gwei) | Cost (100 gwei) |
|-----------|-----|----------------|-----------------|
| Increment | ~195,000 | ~$0.50 | ~$1.00 |
| Decrement | ~195,000 | ~$0.50 | ~$1.00 |
| Pause | ~45,000 | ~$0.12 | ~$0.23 |
| Transfer Ownership | ~50,000 | ~$0.13 | ~$0.26 |

## Support

- Documentation: README.md
- Issues: GitHub Issues
- Security: SECURITY.md

---

**Last Updated:** October 27, 2025  
**Version:** 1.0.0
