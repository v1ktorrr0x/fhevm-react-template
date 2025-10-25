# Migration Guide: Old API → Universal SDK

This guide helps you migrate from the old FHEVM SDK API to the new Universal SDK with wagmi-like hooks.

## Why Migrate?

The new Universal SDK offers:

✅ **Framework-agnostic** - Works in Node.js, React, Vue, any environment  
✅ **Cleaner API** - Wagmi-like patterns, more intuitive  
✅ **Better TypeScript** - Improved types and autocomplete  
✅ **Easier to use** - Less boilerplate, simpler setup  
✅ **Better tested** - 127 comprehensive tests  
✅ **Future-proof** - Modern architecture, actively maintained

## Quick Comparison

### Old API

```typescript
import { useFhevm } from "@fhevm-sdk";

function MyComponent() {
  const { instance, isLoading, error } = useFhevm({
    provider: window.ethereum,
    chainId: 31337,
    mockChains: { 31337: "http://localhost:8545" },
  });

  // Complex encryption setup
  const encrypt = async (value: number) => {
    if (!instance) return;
    const input = instance.createEncryptedInput(contractAddress, userAddress);
    input.add32(value);
    return await input.encrypt();
  };

  // Complex decryption setup
  const decrypt = async (handle: string) => {
    // Manual signature management
    // Manual storage handling
    // Complex implementation
  };
}
```

### New API (Universal SDK)

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from "@fhevm-sdk";

function MyComponent() {
  // Initialize client
  const { client, status, error } = useFhevmClient({
    provider: window.ethereum,
    chainId: 31337,
    mockChains: { 31337: "http://localhost:8545" },
  });

  // Encryption - one line!
  const { encryptU32, canEncrypt } = useEncrypt({
    client,
    contractAddress,
    userAddress,
  });

  // Decryption - one line!
  const { userDecrypt, isDecrypting } = useDecrypt({
    client,
    signer,
  });

  // Use them
  const encrypted = await encryptU32(42);
  const result = await userDecrypt([{ handle, contractAddress }]);
}
```

## Step-by-Step Migration

### Step 1: Update Imports

**Before:**

```typescript
import { useFhevm } from "@fhevm-sdk";
```

**After:**

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from "@fhevm-sdk";
```

### Step 2: Replace `useFhevm` with `useFhevmClient`

**Before:**

```typescript
const { instance, isLoading, error } = useFhevm({
  provider: window.ethereum,
  chainId: 31337,
  mockChains: { 31337: "http://localhost:8545" },
});
```

**After:**

```typescript
const { client, status, error } = useFhevmClient({
  provider: window.ethereum,
  chainId: 31337,
  mockChains: { 31337: "http://localhost:8545" },
});
```

**Changes:**

- `instance` → `client`
- `isLoading` → `status` (more detailed states)
- Same `error` handling

### Step 3: Replace Manual Encryption with `useEncrypt`

**Before:**

```typescript
const encrypt = async (value: number) => {
  if (!instance) throw new Error("Not ready");

  const input = instance.createEncryptedInput(contractAddress, userAddress);
  input.add32(value);
  const encrypted = await input.encrypt();

  return encrypted;
};
```

**After:**

```typescript
const { encryptU32, canEncrypt } = useEncrypt({
  client,
  contractAddress,
  userAddress,
});

// Use it
const encrypted = await encryptU32(value);
```

**Benefits:**

- No manual input creation
- Type-specific methods (`encryptU32`, `encryptU8`, etc.)
- Built-in ready check (`canEncrypt`)
- Cleaner, more readable code

### Step 4: Replace Manual Decryption with `useDecrypt`

**Before:**

```typescript
const decrypt = async (handle: string) => {
  if (!instance) throw new Error("Not ready");

  // Load or create signature
  const sig = await FhevmDecryptionSignature.loadOrSign(
    instance,
    [contractAddress],
    signer,
    storage,
  );

  // Perform decryption
  const result = await instance.userDecrypt(
    [{ handle, contractAddress }],
    sig.privateKey,
    sig.publicKey,
    sig.signature,
    sig.contractAddresses,
    sig.userAddress,
    sig.startTimestamp,
    sig.durationDays,
  );

  return result[handle];
};
```

**After:**

```typescript
const { userDecrypt, isDecrypting } = useDecrypt({
  client,
  signer,
});

// Use it
const result = await userDecrypt([{ handle, contractAddress }]);
const value = result[handle];
```

**Benefits:**

- Automatic signature management
- Automatic storage handling
- Built-in loading state (`isDecrypting`)
- Much simpler code

### Step 5: Update Loading States

**Before:**

```typescript
if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
if (!instance) return null;
```

**After:**

```typescript
if (status === 'loading' || status === 'sdk-loading') {
  return <div>Loading...</div>;
}
if (error) return <div>Error: {error.message}</div>;
if (!client) return null;
```

**Status Values:**

- `idle` - Not started
- `sdk-loading` - Loading SDK
- `sdk-loaded` - SDK loaded
- `sdk-initializing` - Initializing
- `ready` - Ready to use
- `error` - Error occurred

### Step 6: Update Contract Calls

**Before:**

```typescript
const tx = await contract.incrementBy(
  encrypted.handles[0],
  encrypted.inputProof,
);
```

**After:**

```typescript
// Same! No changes needed
const tx = await contract.incrementBy(
  encrypted.handles[0],
  encrypted.inputProof,
);
```

The encrypted input format is identical, so contract calls don't change.

## Complete Example

### Before (Old API)

```typescript
import { useFhevm } from '@fhevm-sdk';
import { FhevmDecryptionSignature } from '@fhevm-sdk';
import { useState } from 'react';

function Counter() {
  const [value, setValue] = useState(0);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const { instance, isLoading, error } = useFhevm({
    provider: window.ethereum,
    chainId: 31337,
    mockChains: { 31337: 'http://localhost:8545' }
  });

  const handleIncrement = async () => {
    if (!instance) return;

    setIsEncrypting(true);
    try {
      const input = instance.createEncryptedInput(contractAddress, userAddress);
      input.add32(5);
      const encrypted = await input.encrypt();

      const tx = await contract.incrementBy(
        encrypted.handles[0],
        encrypted.inputProof
      );
      await tx.wait();
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!instance) return;

    setIsDecrypting(true);
    try {
      const handle = await contract.getCounterHandle();

      const sig = await FhevmDecryptionSignature.loadOrSign(
        instance,
        [contractAddress],
        signer,
        storage
      );

      const result = await instance.userDecrypt(
        [{ handle: handle.toString(), contractAddress }],
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );

      setValue(Number(result[handle.toString()]));
    } finally {
      setIsDecrypting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!instance) return null;

  return (
    <div>
      <button onClick={handleIncrement} disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Increment by 5'}
      </button>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt Counter'}
      </button>
      <div>Value: {value}</div>
    </div>
  );
}
```

### After (Universal SDK)

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm-sdk';
import { useState } from 'react';

function Counter() {
  const [value, setValue] = useState(0);

  // Initialize client
  const { client, status, error } = useFhevmClient({
    provider: window.ethereum,
    chainId: 31337,
    mockChains: { 31337: 'http://localhost:8545' }
  });

  // Encryption hook
  const { encryptU32, canEncrypt } = useEncrypt({
    client,
    contractAddress,
    userAddress
  });

  // Decryption hook
  const { userDecrypt, isDecrypting } = useDecrypt({
    client,
    signer
  });

  const handleIncrement = async () => {
    if (!canEncrypt) return;

    const encrypted = await encryptU32(5);
    const tx = await contract.incrementBy(
      encrypted.handles[0],
      encrypted.inputProof
    );
    await tx.wait();
  };

  const handleDecrypt = async () => {
    const handle = await contract.getCounterHandle();
    const result = await userDecrypt([
      { handle: handle.toString(), contractAddress }
    ]);
    setValue(Number(result[handle.toString()]));
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!client) return null;

  return (
    <div>
      <button onClick={handleIncrement} disabled={!canEncrypt}>
        Increment by 5
      </button>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt Counter'}
      </button>
      <div>Value: {value}</div>
    </div>
  );
}
```

**Lines of Code:**

- Before: ~80 lines
- After: ~50 lines
- **Reduction: 37% less code!**

## Node.js Usage (New!)

The Universal SDK works in Node.js too:

```typescript
import { FhevmClient } from "@fhevm-sdk/core";
import { ethers } from "ethers";

// Initialize
const client = await FhevmClient.create({
  provider: "http://localhost:8545",
  chainId: 31337,
  mockChains: { 31337: "http://localhost:8545" },
});

// Encrypt
const encrypted = await client.encryptU32(42, contractAddress, userAddress);

// Decrypt
const result = await client.userDecrypt([{ handle, contractAddress }], signer);
```

This wasn't possible with the old API!

## Breaking Changes

### 1. Hook Names Changed

| Old               | New                |
| ----------------- | ------------------ |
| `useFhevm()`      | `useFhevmClient()` |
| Manual encryption | `useEncrypt()`     |
| Manual decryption | `useDecrypt()`     |

### 2. Return Values Changed

| Old         | New            |
| ----------- | -------------- |
| `instance`  | `client`       |
| `isLoading` | `status`       |
| N/A         | `canEncrypt`   |
| N/A         | `isDecrypting` |

### 3. Encryption API Changed

**Old:**

```typescript
const input = instance.createEncryptedInput(contract, user);
input.add32(value);
const encrypted = await input.encrypt();
```

**New:**

```typescript
const encrypted = await encryptU32(value);
```

### 4. Decryption API Changed

**Old:**

```typescript
// Manual signature management
const sig = await FhevmDecryptionSignature.loadOrSign(...);
const result = await instance.userDecrypt(...many params...);
```

**New:**

```typescript
const result = await userDecrypt([{ handle, contractAddress }]);
```

## Backward Compatibility

The old API still works! You can migrate gradually:

```typescript
// Old API (still works, but deprecated)
import { useFhevm } from "@fhevm-sdk/react";

// New API (recommended)
import { useFhevmClient, useEncrypt, useDecrypt } from "@fhevm-sdk";
```

You'll see deprecation warnings in the console, but your code won't break.

## Migration Checklist

- [ ] Update imports to new hooks
- [ ] Replace `useFhevm` with `useFhevmClient`
- [ ] Replace manual encryption with `useEncrypt`
- [ ] Replace manual decryption with `useDecrypt`
- [ ] Update loading state checks
- [ ] Test all functionality
- [ ] Remove old imports
- [ ] Update documentation/comments

## Need Help?

- Check the [examples](../../examples/)
- Read the [API documentation](../../README.md#-api-reference)
- See the [Next.js showcase](../../packages/nextjs/app/_components/FHECounterDemo.tsx)
- Review the [Node.js example](../../examples/node-js/)

## Summary

The Universal SDK makes FHEVM development:

- ✅ **Simpler** - Less boilerplate
- ✅ **Cleaner** - Wagmi-like patterns
- ✅ **More powerful** - Works in any environment
- ✅ **Better typed** - Improved TypeScript support
- ✅ **Easier to test** - Better testing utilities

Migration is straightforward and can be done incrementally. The old API still works, so you can migrate at your own pace.

**Happy coding!** 🚀
