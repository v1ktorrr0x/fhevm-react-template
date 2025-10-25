# Node.js Example - Universal FHEVM SDK

This example demonstrates how to use the **Universal FHEVM SDK** in a plain Node.js environment (no React, no Vue, just JavaScript).

## What This Example Shows

✅ **Framework-agnostic** - SDK works in Node.js without any framework  
✅ **Simple setup** - Less than 10 lines to initialize  
✅ **Full FHEVM flow** - Encrypt → Contract call → Decrypt  
✅ **EIP-712 signing** - User decryption with signature  
✅ **Signature caching** - Second decrypt is instant

## Prerequisites

1. **Node.js** >= 20.0.0
2. **pnpm** installed
3. **Hardhat node** running
4. **Contracts deployed** to localhost

## Current Status

✅ **Working!** The Node.js example now works with the Universal FHEVM SDK.

**What Works**:
- ✅ SDK core is framework-agnostic
- ✅ Works in Node.js (this example)
- ✅ Works in React (Next.js showcase)
- ✅ All 127 tests passing
- ✅ ESM imports fixed with `.js` extensions

## Quick Start

### 1. Install Dependencies

From the **root** of the project:

```bash
pnpm install
```

This will install all dependencies including the SDK.

### 2. Start Hardhat Node

In a **separate terminal**:

```bash
pnpm chain
```

Keep this running.

### 3. Deploy Contracts

In **another terminal**:

```bash
pnpm deploy:localhost
```

This will deploy the FHECounter contract.

### 4. Update Contract Address

After deployment, you'll see output like:

```
FHECounter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Update the `CONTRACT_ADDRESS` in `index.js` with this address.

### 5. Run the Example

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

📄 Connected to FHECounter at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

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

📚 What we demonstrated:
  1. ✅ Framework-agnostic SDK (works in Node.js)
  2. ✅ Client initialization (<10 lines)
  3. ✅ Encryption (encryptU32)
  4. ✅ Contract interaction (incrementBy)
  5. ✅ Decryption with EIP-712 signing (userDecrypt)
  6. ✅ Signature caching (second decrypt is instant)
```

## Code Walkthrough

### Initialize FHEVM Client

```javascript
import { FhevmClient } from "@fhevm-sdk/core";

const client = await FhevmClient.create({
  provider: "http://localhost:8545",
  chainId: 31337,
  mockChains: { 31337: "http://localhost:8545" },
});
```

That's it! Less than 10 lines to get started.

### Encrypt a Value

```javascript
const encrypted = await client.encryptU32(
  5, // value to encrypt
  CONTRACT_ADDRESS, // contract address
  userAddress, // user address
);
```

### Call Contract with Encrypted Value

```javascript
const tx = await contract.incrementBy(
  encrypted.handles[0],
  encrypted.inputProof,
);
await tx.wait();
```

### Decrypt the Result

```javascript
const decrypted = await client.userDecrypt(
  [{ handle: counterHandle.toString(), contractAddress: CONTRACT_ADDRESS }],
  signer,
);

const value = decrypted[counterHandle.toString()];
console.log(`Counter value: ${value}`);
```

## Key Features Demonstrated

### 1. Framework-Agnostic Core

The SDK works in **any JavaScript environment**:

- ✅ Node.js (this example)
- ✅ React (see Next.js showcase)
- ✅ Vue (coming soon)
- ✅ Any other framework

### 2. Simple API

Inspired by wagmi, the API is clean and intuitive:

```javascript
// Create client
const client = await FhevmClient.create(config);

// Encrypt
const encrypted = await client.encryptU32(value, contract, user);

// Decrypt
const result = await client.userDecrypt(requests, signer);
```

### 3. Type-Safe

Full TypeScript support with proper types:

```typescript
interface EncryptedInput {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}

interface DecryptResult {
  [handle: string]: string | bigint | boolean;
}
```

### 4. Signature Caching

The first `userDecrypt` call requires EIP-712 signing. Subsequent calls use the cached signature, making them instant.

## Troubleshooting

### Error: connect ECONNREFUSED

**Problem**: Hardhat node is not running.

**Solution**: Start the node in a separate terminal:

```bash
pnpm chain
```

### Error: Contract not deployed

**Problem**: Contracts haven't been deployed to localhost.

**Solution**: Deploy contracts:

```bash
pnpm deploy:localhost
```

### Error: Invalid contract address

**Problem**: The `CONTRACT_ADDRESS` in `index.js` doesn't match the deployed contract.

**Solution**: Update `CONTRACT_ADDRESS` with the address from deployment output.

### Error: Cannot find module '@fhevm-sdk/core'

**Problem**: Dependencies not installed.

**Solution**: Install from root:

```bash
cd ../..
pnpm install
```

## Next Steps

- Check out the **React example** in `packages/nextjs`
- Read the **API documentation** in the main README
- Try modifying the example to use different encryption types
- Experiment with `publicDecrypt` for public values

## Learn More

- [Main README](../../README.md) - Full documentation
- [Quick Start Guide](../../QUICK_START.md) - Get started quickly
- [Development Guide](../../DEVELOPMENT_GUIDE.md) - Complete workflow
- [SDK Design](../../packages/fhevm-sdk/DESIGN.md) - Architecture details

## License

MIT
