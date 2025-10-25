# Testing the Node.js Example

Quick guide to test the Node.js example.

## Prerequisites

- Node.js >= 20.0.0
- pnpm installed
- Project dependencies installed (`npx pnpm install`)

## Quick Test (3 Steps)

### Terminal 1: Start Hardhat Node

```bash
npx pnpm chain
```

**Keep this running!** You should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Terminal 2: Deploy Contracts

```bash
npx pnpm deploy:localhost
```

**Copy the contract address** from the output:
```
FHECounter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                        Copy this address!
```

### Terminal 3: Run Example

1. **Update the contract address** in `examples/node-js/index.js`:
   ```javascript
   // Line 18
   const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Paste your address
   ```

2. **Run the example**:
   ```bash
   cd examples/node-js
   node index.js
   ```

## Expected Output

```
🚀 Universal FHEVM SDK - Node.js Example

📡 Connecting to Hardhat node...
✅ Connected to network: localhost (chainId: 31337)

👤 Using account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

🔐 Initializing FHEVM client...
✅ FHEVM client ready!

📄 Connected to FHECounter at: 0x5FbDB...

🔒 Encrypting value: 5
✅ Value encrypted successfully

📝 Calling incrementBy(5) on contract...
⏳ Transaction sent: 0x...
✅ Transaction confirmed in block 2

📖 Reading counter handle...
Counter handle: 123456789

🔓 Decrypting counter value...
✅ Decrypted counter value: 5

🔓 Decrypting again (using cached signature)...
✅ Decrypted counter value: 5

🎉 Example completed successfully!
```

## Troubleshooting

### Error: "connect ECONNREFUSED"

**Problem**: Hardhat node is not running.

**Solution**: Start it in Terminal 1:
```bash
npx pnpm chain
```

### Error: "Contract not deployed"

**Problem**: Contracts haven't been deployed.

**Solution**: Deploy them in Terminal 2:
```bash
npx pnpm deploy:localhost
```

### Error: "Invalid contract address"

**Problem**: The `CONTRACT_ADDRESS` in `index.js` doesn't match the deployed contract.

**Solution**: 
1. Check the deployment output for the correct address
2. Update line 18 in `examples/node-js/index.js`

### Error: "Cannot find module '@fhevm-sdk/core'"

**Problem**: Dependencies not installed or SDK not built.

**Solution**:
```bash
# From project root
npx pnpm install
npx pnpm sdk:build
```

## What Gets Tested

This example demonstrates:

1. ✅ **Framework-agnostic SDK** - Works in Node.js without React
2. ✅ **Simple initialization** - Less than 10 lines of code
3. ✅ **Encryption** - `encryptU32()` method
4. ✅ **Contract interaction** - Calling `incrementBy()` with encrypted value
5. ✅ **Decryption** - `userDecrypt()` with EIP-712 signing
6. ✅ **Signature caching** - Second decrypt is instant

## Running Multiple Times

You can run the example multiple times. Each run will:
- Increment the counter by 5
- Show the new counter value
- Reuse the cached signature (instant decryption)

## Automated Testing

For automated testing, use the test scripts:

**Linux/Mac**:
```bash
chmod +x test-nodejs-example.sh
./test-nodejs-example.sh
```

**Windows**:
```bash
test-nodejs-example.bat
```

These scripts will:
1. Check if Hardhat node is running
2. Check if contracts are deployed
3. Update the contract address automatically
4. Run the example

## Next Steps

After testing:
- Try modifying the value to encrypt (line 73)
- Try different encryption types (`encryptU8`, `encryptU16`, etc.)
- Check out the React example in `packages/nextjs`
- Read the [Migration Guide](../../docs/guides/MIGRATION_GUIDE.md)

## Need Help?

- [Troubleshooting Guide](../../docs/guides/TROUBLESHOOTING.md)
- [Main README](../../README.md)
- [Quick Start Guide](../../QUICK_START.md)
