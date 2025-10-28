# Deployment Guide

## Prerequisites

- Node.js 20.0.0 or higher
- pnpm package manager
- MetaMask or compatible Web3 wallet
- Testnet ETH (for Sepolia deployment)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Local Development

```bash
# Terminal 1: Start local blockchain
pnpm chain

# Terminal 2: Deploy contracts
pnpm deploy:localhost

# Terminal 3: Start frontend
pnpm start
```

Visit `http://localhost:3000`

## Network Configuration

### Supported Networks

| Network | Chain ID | RPC URL | Status |
|---------|----------|---------|--------|
| Localhost | 31337 | http://localhost:8545 | ✅ Supported |
| Sepolia | 11155111 | https://sepolia.infura.io | ✅ Supported |

### Adding New Networks

Edit `packages/nextjs/app/_components/FHECounterDemo.tsx`:

```typescript
const SUPPORTED_NETWORKS = {
  31337: { name: 'Localhost', rpc: 'http://localhost:8545' },
  11155111: { name: 'Sepolia', rpc: 'https://...' },
  // Add your network here
};
```

## Deployment Steps

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

1. **Get Testnet ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Request test ETH

2. **Configure Environment**
   ```bash
   # packages/hardhat/.env
   DEPLOYER_PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC_URL=your_rpc_url_here
   ```

3. **Deploy Contract**
   ```bash
   pnpm deploy:sepolia
   ```

4. **Verify Contract** (Optional)
   ```bash
   pnpm verify:sepolia
   ```

5. **Start Frontend**
   ```bash
   pnpm start
   ```

### Mainnet Deployment (Not Recommended Yet)

⚠️ **WARNING**: Complete security audit and Phase 2 optimizations before mainnet deployment.

```bash
# Configure mainnet settings
# packages/hardhat/.env
DEPLOYER_PRIVATE_KEY=your_private_key_here
MAINNET_RPC_URL=your_rpc_url_here

# Deploy (when ready)
pnpm deploy:mainnet

# Verify
pnpm verify:mainnet
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check contract address
cat packages/nextjs/contracts/deployedContracts.ts

# Test contract interaction
pnpm hardhat:test
```

### 2. Update Frontend

The frontend automatically detects deployed contracts from `deployedContracts.ts`.

### 3. Test Functionality

- Connect wallet
- Increment counter
- Decrement counter
- Decrypt value
- Check events in block explorer

## Configuration

### Smart Contract

Edit `packages/hardhat/contracts/FHECounter.sol`:

```solidity
// Customize contract parameters
constructor() {
    owner = msg.sender;
    _count = FHE.asEuint32(0);
    // Add custom initialization
}
```

### Frontend

Edit `packages/nextjs/app/_components/FHECounterDemo.tsx`:

```typescript
// Customize UI constants
const UI_UPDATE_DELAY = 50; // ms
const BLOCKCHAIN_SETTLE_DELAY = 1500; // ms
const SUCCESS_MESSAGE_DURATION = 3000; // ms
```

## Troubleshooting

### Common Issues

**Issue**: Contract not deploying
```bash
# Solution: Check network connection and gas settings
pnpm hardhat:clean
pnpm hardhat:compile
pnpm deploy:localhost
```

**Issue**: Frontend not connecting
```bash
# Solution: Regenerate contract types
pnpm generate
pnpm start
```

**Issue**: FHEVM client initialization fails
```bash
# Solution: Check network configuration
# Ensure correct chain ID and RPC URL
```

### Debug Mode

Enable debug logging:

```typescript
// In FHECounterDemo.tsx
useEffect(() => {
  console.log('[DEBUG] Client status:', status);
  console.log('[DEBUG] Can encrypt:', canEncrypt);
  console.log('[DEBUG] Contract address:', contractAddress);
}, [status, canEncrypt, contractAddress]);
```

## Performance Optimization

### Production Build

```bash
# Build optimized frontend
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

Monitor contract events using block explorer or:

```typescript
// Listen to events
contract.on('CounterIncremented', (user, timestamp) => {
  console.log(`Counter incremented by ${user} at ${timestamp}`);
});
```

### Performance Metrics

Track key metrics:
- Time to Interactive (TTI)
- Encryption time
- Transaction confirmation time
- Error rates

## Security Checklist

### Before Deployment

- [ ] Environment variables configured
- [ ] Private keys secured
- [ ] Contract compiled without warnings
- [ ] Tests passing
- [ ] Gas costs reviewed
- [ ] Network configuration verified

### After Deployment

- [ ] Contract address verified
- [ ] Ownership transferred (if needed)
- [ ] Events monitoring configured
- [ ] Backup of deployment artifacts
- [ ] Documentation updated

## Rollback Procedure

If issues are discovered:

1. **Pause Contract**
   ```solidity
   // Call pause() function as owner
   await contract.pause();
   ```

2. **Deploy Fixed Version**
   ```bash
   pnpm deploy:sepolia
   ```

3. **Update Frontend**
   ```bash
   pnpm generate
   pnpm start
   ```

4. **Notify Users**
   - Update UI with migration notice
   - Provide new contract address

## Cost Estimates

### Deployment Costs

| Network | Deployment | Verification | Total |
|---------|-----------|--------------|-------|
| Localhost | Free | N/A | Free |
| Sepolia | ~$0.50 | Free | ~$0.50 |
| Mainnet | ~$500-1000 | ~$50 | ~$550-1050 |

### Operation Costs (Mainnet)

| Operation | Gas | Cost (50 gwei) | Cost (100 gwei) |
|-----------|-----|----------------|-----------------|
| Increment | ~195,000 | ~$0.50 | ~$1.00 |
| Decrement | ~195,000 | ~$0.50 | ~$1.00 |
| Pause | ~45,000 | ~$0.12 | ~$0.23 |
| Transfer Ownership | ~50,000 | ~$0.13 | ~$0.26 |

## Support

- **Documentation**: See README.md
- **Issues**: GitHub Issues
- **Security**: See SECURITY.md
- **Community**: [Discord/Telegram link]

---

**Last Updated**: October 27, 2025  
**Version**: 1.0.0
