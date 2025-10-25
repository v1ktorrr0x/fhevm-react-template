# Troubleshooting Guide

Common issues and solutions when using the Universal FHEVM SDK.

## Installation Issues

### Error: `pnpm` not found

**Problem**: pnpm is not installed on your system.

**Solution**:

```bash
npm install -g pnpm
```

Or use npx:

```bash
npx pnpm install
```

### Error: Node version mismatch

**Problem**: Your Node.js version is too old.

**Solution**: Install Node.js >= 20.0.0

```bash
node --version  # Should be >= 20.0.0
```

Download from: https://nodejs.org/

### Error: Cannot find module '@fhevm-sdk'

**Problem**: Dependencies not installed or SDK not built.

**Solution**:

```bash
# From root directory
npx pnpm install  # This automatically builds the SDK
```

If that doesn't work:

```bash
# Build SDK manually
npx pnpm sdk:build
```

## Runtime Issues

### Error: "FhevmClient not ready"

**Problem**: Trying to use the client before initialization completes.

**Solution**: Check the status before using:

```typescript
const { client, status } = useFhevmClient({ ... });

// Wait for ready status
if (status !== 'ready' || !client) {
  return <div>Loading...</div>;
}

// Now safe to use client
```

Or use the ready check:

```typescript
if (!client?.isReady()) {
  return <div>Loading...</div>;
}
```

### Error: "connect ECONNREFUSED ::1:8545"

**Problem**: Hardhat node is not running.

**Solution**: Start the Hardhat node in a separate terminal:

```bash
npx pnpm chain
```

Keep this terminal running while developing.

### Error: "Contract not deployed"

**Problem**: Contracts haven't been deployed to the network.

**Solution**: Deploy contracts:

```bash
# For localhost
npx pnpm deploy:localhost

# For Sepolia
npx pnpm deploy:sepolia
```

### Error: "Cannot encrypt: client, contractAddress, or userAddress not ready"

**Problem**: Missing required parameters for encryption.

**Solution**: Ensure all parameters are provided:

```typescript
const { encryptU32, canEncrypt } = useEncrypt({
  client, // Must be ready
  contractAddress, // Must be defined
  userAddress, // Must be defined
});

// Check before encrypting
if (!canEncrypt) {
  console.log("Not ready to encrypt");
  return;
}
```

### Error: "Failed to create decryption signature"

**Problem**: User rejected the EIP-712 signature request or signer is invalid.

**Solution**:

1. Make sure the user approves the signature request in their wallet
2. Ensure the signer is valid:

```typescript
const { userDecrypt } = useDecrypt({
  client,
  signer, // Must be a valid JsonRpcSigner
});
```

3. Check that the wallet is connected:

```typescript
const signer = await provider.getSigner();
```

## Test Issues

### Error: "27 tests failed"

**Problem**: Tests that require Hardhat node are failing.

**Solution**: This is expected! Start Hardhat node first:

```bash
# Terminal 1: Start Hardhat node
npx pnpm chain

# Terminal 2: Run tests
npx pnpm sdk:test
```

All 127 tests should pass with Hardhat running.

### Error: "Cannot find module 'fake-indexeddb'"

**Problem**: Dev dependencies not installed.

**Solution**:

```bash
cd packages/fhevm-sdk
npx pnpm install
```

### Tests timeout

**Problem**: Tests are taking too long or hanging.

**Solution**:

1. Increase timeout in test file:

```typescript
it("should work", async () => {
  // test code
}, 10000); // 10 second timeout
```

2. Check if Hardhat node is responsive:

```bash
curl http://localhost:8545
```

## Build Issues

### Error: "Cannot find module './core/client'"

**Problem**: SDK not built or build failed.

**Solution**:

```bash
cd packages/fhevm-sdk
npx pnpm build
```

Check for TypeScript errors in the output.

### Error: TypeScript compilation failed

**Problem**: Type errors in the code.

**Solution**:

1. Check the error message for the file and line number
2. Fix the type error
3. Rebuild:

```bash
npx pnpm sdk:build
```

### Error: "Module not found: Can't resolve '@fhevm-sdk'"

**Problem**: Next.js can't find the SDK.

**Solution**:

1. Build the SDK:

```bash
npx pnpm sdk:build
```

2. Restart Next.js dev server:

```bash
npx pnpm start
```

## Network Issues

### Error: "Unsupported network"

**Problem**: Trying to use FHEVM on an unsupported network.

**Solution**: FHEVM only works on:

- Localhost (chainId: 31337) with mock
- Sepolia testnet (chainId: 11155111)

For localhost, provide mockChains:

```typescript
const { client } = useFhevmClient({
  provider: window.ethereum,
  chainId: 31337,
  mockChains: { 31337: "http://localhost:8545" },
});
```

### Error: "Network mismatch"

**Problem**: Wallet is on a different network than expected.

**Solution**: Switch network in your wallet:

- For localhost: Add custom network with RPC http://localhost:8545 and chainId 31337
- For Sepolia: Switch to Sepolia testnet

### Error: "Relayer SDK not available"

**Problem**: FHEVM Relayer SDK failed to load.

**Solution**:

1. Check your internet connection (SDK loads from CDN)
2. For localhost, ensure mockChains is configured:

```typescript
mockChains: { 31337: 'http://localhost:8545' }
```

3. Check browser console for more details

## React Issues

### Error: "Rendered more hooks than during the previous render"

**Problem**: Conditional hook usage.

**Solution**: Always call hooks unconditionally:

```typescript
// ❌ Wrong
if (someCondition) {
  const { client } = useFhevmClient({ ... });
}

// ✅ Correct
const { client } = useFhevmClient({
  provider: someCondition ? window.ethereum : undefined,
  enabled: someCondition
});
```

### Error: "Cannot read property 'isReady' of undefined"

**Problem**: Trying to use client before it's initialized.

**Solution**: Add null checks:

```typescript
const { client } = useFhevmClient({ ... });

// ❌ Wrong
if (client.isReady()) { ... }

// ✅ Correct
if (client?.isReady()) { ... }
```

### Hook not updating

**Problem**: Component not re-rendering when client status changes.

**Solution**: Make sure you're using the status from the hook:

```typescript
const { client, status } = useFhevmClient({ ... });

// This will trigger re-renders
if (status === 'loading') return <div>Loading...</div>;
if (status === 'ready') return <div>Ready!</div>;
```

## Node.js Issues

### Error: "window is not defined"

**Problem**: Trying to use browser-specific code in Node.js.

**Solution**: Use the core API instead of React hooks:

```typescript
// ❌ Wrong (React hooks in Node.js)
import { useFhevmClient } from "@fhevm-sdk";

// ✅ Correct (Core API in Node.js)
import { FhevmClient } from "@fhevm-sdk/core";
```

### Error: "Cannot find module '@fhevm-sdk/core'"

**Problem**: SDK not built or not installed.

**Solution**:

```bash
# From root directory
npx pnpm install
npx pnpm sdk:build
```

### Error: "fetch is not defined"

**Problem**: Node.js version too old (< 18).

**Solution**: Upgrade to Node.js >= 20.0.0

## Performance Issues

### Encryption is slow

**Problem**: First encryption takes time to initialize.

**Solution**: This is normal! The first encryption:

1. Loads the FHEVM SDK (~2-3 seconds)
2. Initializes the instance (~1-2 seconds)
3. Performs encryption (~1 second)

Subsequent encryptions are much faster (~100-200ms).

### Decryption is slow

**Problem**: First decryption requires EIP-712 signing.

**Solution**: This is normal! The first decryption:

1. Requests signature from user (~5-10 seconds)
2. Stores signature in IndexedDB
3. Performs decryption (~1-2 seconds)

Subsequent decryptions use cached signature and are faster (~500ms-1s).

### App is slow to load

**Problem**: SDK initialization on every page load.

**Solution**: Initialize once at app level:

```typescript
// app/layout.tsx or _app.tsx
function RootLayout({ children }) {
  return (
    <FhevmProvider>
      {children}
    </FhevmProvider>
  );
}

// Then use in components
function MyComponent() {
  const { client } = useFhevmClient({ ... });
  // Client is shared across components
}
```

## Browser Issues

### Error: "IndexedDB not available"

**Problem**: Browser doesn't support IndexedDB or it's disabled.

**Solution**:

1. Use a modern browser (Chrome, Firefox, Safari, Edge)
2. Enable IndexedDB in browser settings
3. Check if in private/incognito mode (some browsers disable IndexedDB)

### Error: "MetaMask not found"

**Problem**: MetaMask extension not installed.

**Solution**:

1. Install MetaMask: https://metamask.io/
2. Or use another EIP-1193 compatible wallet
3. Or provide a custom provider:

```typescript
const { client } = useFhevmClient({
  provider: "http://localhost:8545", // Direct RPC
  chainId: 31337,
});
```

### Wallet not connecting

**Problem**: Wallet connection rejected or failed.

**Solution**:

1. Check if wallet is unlocked
2. Approve the connection request
3. Try refreshing the page
4. Check browser console for errors

## Common Mistakes

### 1. Not waiting for client to be ready

```typescript
// ❌ Wrong
const { client } = useFhevmClient({ ... });
const encrypted = await client.encryptU32(42);  // May fail!

// ✅ Correct
const { client, status } = useFhevmClient({ ... });
if (status !== 'ready' || !client) return;
const encrypted = await client.encryptU32(42);
```

### 2. Not providing mockChains for localhost

```typescript
// ❌ Wrong (won't work on localhost)
const { client } = useFhevmClient({
  provider: window.ethereum,
  chainId: 31337,
});

// ✅ Correct
const { client } = useFhevmClient({
  provider: window.ethereum,
  chainId: 31337,
  mockChains: { 31337: "http://localhost:8545" },
});
```

### 3. Not handling errors

```typescript
// ❌ Wrong
const encrypted = await encryptU32(42);

// ✅ Correct
try {
  const encrypted = await encryptU32(42);
} catch (error) {
  console.error("Encryption failed:", error);
  // Handle error appropriately
}
```

### 4. Using wrong contract address

```typescript
// ❌ Wrong (hardcoded address)
const contractAddress = "0x1234...";

// ✅ Correct (from deployment)
import deployedContracts from "../contracts/deployedContracts";
const contractAddress = deployedContracts[31337].FHECounter.address;
```

## Still Having Issues?

1. **Check the examples**:
   - [Next.js showcase](../../packages/nextjs/app/_components/FHECounterDemo.tsx)
   - [Node.js example](../../examples/node-js/)

2. **Read the documentation**:
   - [README](../../README.md)
   - [Quick Start](../../QUICK_START.md)
   - [Development Guide](../../DEVELOPMENT_GUIDE.md)

3. **Check the tests**:
   - Tests show correct usage patterns
   - Located in `packages/fhevm-sdk/test/`

4. **Enable debug logging**:

```typescript
const { client, status } = useFhevmClient({
  provider: window.ethereum,
  chainId: 31337,
  onStatusChange: (status) => {
    console.log("FHEVM Status:", status);
  },
});
```

5. **Check browser console**:
   - Look for error messages
   - Check network tab for failed requests
   - Look for warnings

6. **Verify setup**:

```bash
# Check Node version
node --version  # Should be >= 20.0.0

# Check pnpm
npx pnpm --version

# Check Hardhat node
curl http://localhost:8545

# Rebuild everything
npx pnpm install
npx pnpm sdk:build
npx pnpm start
```

## Getting Help

If you're still stuck:

1. Check existing GitHub issues
2. Create a new issue with:
   - Error message
   - Code snippet
   - Steps to reproduce
   - Environment details (OS, Node version, browser)

**Good luck!** 🚀
