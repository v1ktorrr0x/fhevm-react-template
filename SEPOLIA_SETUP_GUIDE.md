# Sepolia Deployment Setup Guide

**Error**: `invalid project id` when deploying to Sepolia  
**Cause**: Missing or invalid Infura API key  
**Solution**: Follow the steps below

---

## 🔑 Required: Get an Infura API Key

### Step 1: Create Infura Account

1. Go to https://infura.io/
2. Click "Sign Up" (it's free!)
3. Verify your email
4. Log in to your dashboard

### Step 2: Create a New Project

1. Click "Create New Key" or "Create New Project"
2. Select **"Web3 API"** as the network
3. Give it a name (e.g., "FHEVM React Template")
4. Click "Create"

### Step 3: Get Your API Key

1. Click on your project name
2. Find the **"API Key"** section
3. Copy the key (it looks like: `abc123def456...`)

---

## ⚙️ Configure Hardhat

### Option 1: Using Hardhat Vars (Recommended)

This is the **secure** way - keys are stored encrypted:

```bash
# Navigate to hardhat directory
cd packages/hardhat

# Set your Infura API key
npx hardhat vars set INFURA_API_KEY
# Paste your key when prompted

# Set your mnemonic (12 words from your wallet)
npx hardhat vars set MNEMONIC
# Paste your 12-word mnemonic when prompted

# Verify they're set
npx hardhat vars list
```

### Option 2: Using .env File (Alternative)

If you prefer `.env` files:

```bash
# Create .env file in packages/hardhat/
cd packages/hardhat
touch .env  # or create manually on Windows

# Add these lines to .env:
INFURA_API_KEY=your_actual_infura_api_key_here
MNEMONIC=your twelve word mnemonic phrase goes here
```

**⚠️ Important**: Never commit `.env` to git! It's already in `.gitignore`.

---

## 💰 Get Sepolia Test ETH

You need test ETH to deploy contracts and pay for gas.

### Recommended Faucets

1. **Alchemy Sepolia Faucet** (Best)
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - Requires Alchemy account (free)
   - Gives 0.5 ETH per day

2. **Sepolia PoW Faucet**
   - https://sepolia-faucet.pk910.de/
   - Mine for test ETH (no account needed)
   - Takes ~10-30 minutes

3. **QuickNode Faucet**
   - https://faucet.quicknode.com/ethereum/sepolia
   - Requires Twitter account
   - Gives 0.1 ETH

### Check Your Balance

```bash
# After getting test ETH, verify you have it
npx hardhat --network sepolia task:address
```

---

## 🚀 Deploy to Sepolia

Once you have:
- ✅ Infura API key configured
- ✅ Mnemonic configured
- ✅ Test ETH in your wallet

Run the deployment:

```bash
# From project root
pnpm deploy:sepolia

# This will:
# 1. Compile contracts
# 2. Deploy to Sepolia
# 3. Generate TypeScript ABIs
```

### Expected Output

```
Deploying FHECounter...
✓ FHECounter deployed to: 0x1234...5678
✓ Deployment complete!
✓ Generating TypeScript ABIs...
✓ Done!
```

---

## 🧪 Verify Deployment

### Check Contract on Etherscan

1. Go to https://sepolia.etherscan.io/
2. Search for your contract address
3. You should see your deployed contract

### Test in the App

1. Open http://localhost:3000
2. Connect your wallet
3. Switch to Sepolia network
4. You should see:
   - ✓ FHEVM Client: Ready
   - ✓ Contract: Deployed
   - Network: Sepolia Testnet (Chain ID: 11155111)

---

## 🐛 Troubleshooting

### Error: "invalid project id"

**Problem**: Infura API key not set or invalid

**Solution**:
```bash
# Check if key is set
cd packages/hardhat
npx hardhat vars list

# If not set or wrong, set it again
npx hardhat vars set INFURA_API_KEY
```

### Error: "insufficient funds"

**Problem**: Not enough Sepolia ETH for gas

**Solution**:
1. Get more test ETH from faucets (see above)
2. Check balance: `npx hardhat --network sepolia task:address`
3. Wait for faucet transaction to confirm

### Error: "invalid mnemonic"

**Problem**: Mnemonic not set or incorrect format

**Solution**:
```bash
# Set mnemonic (12 words from your wallet)
npx hardhat vars set MNEMONIC

# Format: "word1 word2 word3 ... word12"
# Example: "test test test test test test test test test test test junk"
```

### Error: "network connection failed"

**Problem**: Can't connect to Sepolia RPC

**Solution**:
1. Check Infura API key is correct
2. Test RPC connection:
   ```bash
   curl https://sepolia.infura.io/v3/YOUR_KEY \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```
3. Try again in a few minutes (network might be congested)

---

## 📝 Quick Reference

### Commands

```bash
# Set up credentials
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set MNEMONIC

# Deploy to Sepolia
pnpm deploy:sepolia

# Generate ABIs
pnpm generate

# Verify contract (optional)
cd packages/hardhat
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>

# Test contract
npx hardhat --network sepolia task:decrypt-count
npx hardhat --network sepolia task:increment --value 1
```

### Environment Variables

| Variable | Required | Where to Get |
|----------|----------|--------------|
| `INFURA_API_KEY` | ✅ Yes | https://infura.io/ |
| `MNEMONIC` | ✅ Yes | Your wallet's 12-word phrase |
| `ETHERSCAN_API_KEY` | ❌ Optional | https://etherscan.io/apis (for verification) |

---

## ✅ Checklist

Before deploying to Sepolia:

- [ ] Created Infura account
- [ ] Got Infura API key
- [ ] Set `INFURA_API_KEY` in Hardhat vars
- [ ] Set `MNEMONIC` in Hardhat vars
- [ ] Got Sepolia test ETH (at least 0.1 ETH)
- [ ] Verified test ETH arrived in wallet
- [ ] Ready to deploy!

After deploying:

- [ ] Deployment succeeded
- [ ] Contract address received
- [ ] ABIs generated (`pnpm generate`)
- [ ] Contract visible on Sepolia Etherscan
- [ ] App works on Sepolia network
- [ ] Can interact with contract

---

## 🎯 Summary

**To deploy to Sepolia, you need**:

1. **Infura API Key** - Get from https://infura.io/ (free)
2. **Wallet Mnemonic** - Your 12-word recovery phrase
3. **Sepolia ETH** - Get from faucets (free)

**Then run**:
```bash
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set MNEMONIC
pnpm deploy:sepolia
```

**That's it!** Your contract will be deployed to Sepolia and the app will work on the testnet! 🎉

---

## 🔒 Security Notes

- ✅ **DO** use Hardhat vars (encrypted storage)
- ✅ **DO** use a test wallet for Sepolia (not your main wallet)
- ✅ **DO** keep your mnemonic private
- ❌ **DON'T** commit `.env` files to git
- ❌ **DON'T** share your mnemonic with anyone
- ❌ **DON'T** use your main wallet's mnemonic

---

**Need Help?**
- Infura Docs: https://docs.infura.io/
- Hardhat Docs: https://hardhat.org/
- Sepolia Faucets: https://faucetlink.to/sepolia

**Last Updated**: October 23, 2025
