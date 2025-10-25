# Universal FHEVM SDK - API Documentation

**Version**: 0.1.0  
**Last Updated**: October 22, 2025  
**Status**: Production Ready

Complete API reference for the Universal FHEVM SDK.

---

## Table of Contents

- [Installation](#installation)
- [Core API](#core-api)
  - [FhevmClient](#fhevmclient)
- [React Hooks API](#react-hooks-api)
  - [useFhevmClient](#usefhevmclientparams)
  - [useEncrypt](#useencryptparams)
  - [useDecrypt](#usedecryptparams)
- [Types](#types)
- [Usage Patterns](#usage-patterns)
- [Advanced Usage](#advanced-usage)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Examples](#examples)

---

## Installation

```bash
npm install @fhevm-sdk
# or
pnpm add @fhevm-sdk
# or
yarn add @fhevm-sdk
```

---

## Core API

### `FhevmClient`

Framework-agnostic client for FHEVM operations.

#### `FhevmClient.create(config)`

Creates a new FHEVM client instance.

**Parameters**:
- `config.provider` (string | Eip1193Provider) - Ethereum provider or RPC URL
- `config.chainId` (number, optional) - Chain ID (11155111 for Sepolia)
- `config.signal` (AbortSignal, optional) - Abort signal for cancellation
- `config.onStatusChange` (function, optional) - Status change callback

**Returns**: `Promise<FhevmClient>`

**Example**:
```typescript
import { FhevmClient } from '@fhevm-sdk/core';

const client = await FhevmClient.create({
  provider: window.ethereum,
  chainId: 11155111
});
```

#### `client.isReady()`

Checks if the client is ready to use.

**Returns**: `boolean`

**Example**:
```typescript
if (client.isReady()) {
  // Client is ready
}
```

#### `client.getStatus()`

Gets the current client status.

**Returns**: `FhevmStatus` - One of: `"idle"`, `"sdk-loading"`, `"sdk-loaded"`, `"sdk-initializing"`, `"sdk-initialized"`, `"creating"`, `"ready"`, `"error"`

**Example**:
```typescript
const status = client.getStatus();
console.log(status); // "ready"
```

#### `client.encrypt(value, type, contractAddress, userAddress)`

Encrypts a value with the specified type.

**Parameters**:
- `value` (number | bigint | boolean) - Value to encrypt
- `type` (FhevmType) - Encryption type: `"bool"`, `"uint8"`, `"uint16"`, `"uint32"`, `"uint64"`, `"uint128"`, `"uint256"`, `"address"`
- `contractAddress` (string) - Contract address
- `userAddress` (string) - User address

**Returns**: `Promise<EncryptedInput>`

**Example**:
```typescript
const encrypted = await client.encrypt(42, "uint32", contractAddress, userAddress);
```

#### `client.encryptBool(value, contractAddress, userAddress)`

Encrypts a boolean value.

**Parameters**:
- `value` (boolean) - Boolean to encrypt
- `contractAddress` (string) - Contract address
- `userAddress` (string) - User address

**Returns**: `Promise<EncryptedInput>`

**Example**:
```typescript
const encrypted = await client.encryptBool(true, contractAddress, userAddress);
```

#### `client.encryptU8(value, contractAddress, userAddress)`

Encrypts a uint8 value (0-255).

**Parameters**:
- `value` (number) - Number to encrypt (0-255)
- `contractAddress` (string) - Contract address
- `userAddress` (string) - User address

**Returns**: `Promise<EncryptedInput>`

**Example**:
```typescript
const encrypted = await client.encryptU8(255, contractAddress, userAddress);
```

#### `client.encryptU16(value, contractAddress, userAddress)`

Encrypts a uint16 value (0-65535).

**Parameters**:
- `value` (number) - Number to encrypt (0-65535)
- `contractAddress` (string) - Contract address
- `userAddress` (string) - User address

**Returns**: `Promise<EncryptedInput>`

**Example**:
```typescript
const encrypted = await client.encryptU16(1000, contractAddress, userAddress);
```

#### `client.encryptU32(value, contractAddress, userAddress)`

Encrypts a uint32 value.

**Parameters**:
- `value` (number) - Number to encrypt
- `contractAddress` (string) - Contract address
- `userAddress` (string) - User address

**Returns**: `Promise<EncryptedInput>`

**Example**:
```typescript
const encrypted = await client.encryptU32(42, contractAddress, userAddress);
```

#### `client.encryptU64(value, contractAddress, userAddress)`

Encrypts a uint64 value.

**Parameters**:
- `value` (bigint) - BigInt to encrypt
- `contractAddress` (string) - Contract address
- `userAddress` (string) - User address

**Returns**: `Promise<EncryptedInput>`

**Example**:
```typescript
const encrypted = await client.encryptU64(9007199254740991n, contractAddress, userAddress);
```

#### `client.userDecrypt(requests, signer)`

Decrypts encrypted handles using user's private key (requires EIP-712 signature).

**Parameters**:
- `requests` (DecryptRequest[]) - Array of decrypt requests
- `signer` (JsonRpcSigner) - Ethers signer for EIP-712 signing

**Returns**: `Promise<DecryptResult>`

**Example**:
```typescript
const result = await client.userDecrypt([
  { handle: "0x123...", contractAddress: "0xabc..." }
], signer);

const value = result["0x123..."]; // Decrypted value
```

#### `client.publicDecrypt(handles)`

Decrypts public handles (no signature required).

**Parameters**:
- `handles` (string[]) - Array of handles to decrypt

**Returns**: `Promise<DecryptResult>`

**Example**:
```typescript
const result = await client.publicDecrypt(["0x123...", "0x456..."]);
const value1 = result["0x123..."];
const value2 = result["0x456..."];
```

#### `client.getPublicKey()`

Gets the public key for encryption.

**Returns**: `{ publicKeyId: string; publicKey: Uint8Array } | null`

**Example**:
```typescript
const publicKey = client.getPublicKey();
console.log(publicKey.publicKeyId);
```

#### `client.getInstance()`

Gets the underlying FHEVM instance (for advanced use).

**Returns**: `FhevmInstance`

**Example**:
```typescript
const instance = client.getInstance();
// Use for advanced operations
```

---

## React Hooks API

### `useFhevmClient(params)`

Manages FHEVM client lifecycle in React.

**Parameters**:
- `params.provider` (string | Eip1193Provider | undefined) - Ethereum provider or RPC URL
- `params.chainId` (number, optional) - Chain ID
- `params.enabled` (boolean, optional) - Enable/disable the hook (default: true)

**Returns**:
```typescript
{
  client: FhevmClient | undefined;
  status: FhevmStatus;
  error: Error | undefined;
  refresh: () => void;
}
```

**Example**:
```typescript
import { useFhevmClient } from '@fhevm-sdk';

function MyComponent() {
  const { client, status, error } = useFhevmClient({
    provider: window.ethereum,
    chainId: 11155111
  });

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!client) return null;

  // Use client...
}
```

### `useEncrypt(params)`

Provides encryption methods.

**Parameters**:
- `params.client` (FhevmClient | undefined) - FHEVM client instance
- `params.contractAddress` (string | undefined) - Contract address
- `params.userAddress` (string | undefined) - User address

**Returns**:
```typescript
{
  canEncrypt: boolean;
  encrypt: (value, type) => Promise<EncryptedInput>;
  encryptBool: (value) => Promise<EncryptedInput>;
  encryptU8: (value) => Promise<EncryptedInput>;
  encryptU16: (value) => Promise<EncryptedInput>;
  encryptU32: (value) => Promise<EncryptedInput>;
  encryptU64: (value) => Promise<EncryptedInput>;
}
```

**Example**:
```typescript
import { useEncrypt } from '@fhevm-sdk';

function MyComponent() {
  const { client } = useFhevmClient({...});
  const { encryptU32, canEncrypt } = useEncrypt({
    client,
    contractAddress: "0x...",
    userAddress: "0x..."
  });

  const handleEncrypt = async () => {
    if (!canEncrypt) return;
    const encrypted = await encryptU32(42);
    // Use encrypted.handles[0] and encrypted.inputProof in contract call
  };
}
```

### `useDecrypt(params)`

Provides decryption methods.

**Parameters**:
- `params.client` (FhevmClient | undefined) - FHEVM client instance
- `params.signer` (JsonRpcSigner | undefined) - Ethers signer for EIP-712 signing

**Returns**:
```typescript
{
  userDecrypt: (requests) => Promise<DecryptResult>;
  publicDecrypt: (handles) => Promise<DecryptResult>;
  isDecrypting: boolean;
}
```

**Example**:
```typescript
import { useDecrypt } from '@fhevm-sdk';

function MyComponent() {
  const { client } = useFhevmClient({...});
  const { userDecrypt, isDecrypting } = useDecrypt({
    client,
    signer
  });

  const handleDecrypt = async () => {
    const result = await userDecrypt([
      { handle: "0x123...", contractAddress: "0xabc..." }
    ]);
    const value = result["0x123..."];
    console.log("Decrypted:", value);
  };
}
```

---

## Types

### `FhevmConfig`

Configuration for creating an FHEVM client.

```typescript
interface FhevmConfig {
  provider: string | Eip1193Provider;
  chainId?: number;
  signal?: AbortSignal;
  onStatusChange?: (status: FhevmStatus) => void;
}
```

### `FhevmStatus`

Client status during initialization.

```typescript
type FhevmStatus = 
  | "idle"
  | "sdk-loading"
  | "sdk-loaded"
  | "sdk-initializing"
  | "sdk-initialized"
  | "creating"
  | "ready"
  | "error";
```

### `EncryptedInput`

Result from encryption operations.

```typescript
interface EncryptedInput {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}
```

### `DecryptRequest`

Request for decrypting an encrypted handle.

```typescript
interface DecryptRequest {
  handle: string;
  contractAddress: `0x${string}`;
}
```

### `DecryptResult`

Result of decryption operations.

```typescript
interface DecryptResult {
  [handle: string]: string | bigint | boolean;
}
```

### `FhevmType`

FHEVM encrypted type.

```typescript
type FhevmType = 
  | "bool"
  | "uint8"
  | "uint16"
  | "uint32"
  | "uint64"
  | "uint128"
  | "uint256"
  | "address";
```

---

## Usage Patterns

### Basic Setup (React)

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm-sdk';

function App() {
  // 1. Initialize client
  const { client, status, error } = useFhevmClient({
    provider: window.ethereum,
    chainId: 11155111
  });

  // 2. Setup encryption
  const { encryptU32, canEncrypt } = useEncrypt({
    client,
    contractAddress: "0x...",
    userAddress: "0x..."
  });

  // 3. Setup decryption
  const { userDecrypt, isDecrypting } = useDecrypt({
    client,
    signer
  });

  // 4. Use in your app
  const handleAction = async () => {
    const encrypted = await encryptU32(42);
    const tx = await contract.someMethod(encrypted.handles[0], encrypted.inputProof);
    await tx.wait();
    
    const handle = await contract.getHandle();
    const result = await userDecrypt([{ handle, contractAddress }]);
    console.log("Value:", result[handle]);
  };
}
```

### Basic Setup (Node.js)

```typescript
import { FhevmClient } from '@fhevm-sdk/core';
import { ethers } from 'ethers';

async function main() {
  // 1. Initialize client
  const client = await FhevmClient.create({
    provider: 'https://sepolia.infura.io/v3/YOUR_KEY',
    chainId: 11155111
  });

  // 2. Encrypt
  const encrypted = await client.encryptU32(42, contractAddress, userAddress);

  // 3. Use in contract call
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.someMethod(encrypted.handles[0], encrypted.inputProof);
  await tx.wait();

  // 4. Decrypt
  const handle = await contract.getHandle();
  const result = await client.userDecrypt([{ handle, contractAddress }], signer);
  console.log("Value:", result[handle]);
}
```

---

## Advanced Usage

### Custom Status Tracking

```typescript
const { client, status } = useFhevmClient({
  provider: window.ethereum,
  chainId: 11155111,
  onStatusChange: (status) => {
    console.log("Status changed:", status);
  }
});

// React to status changes
useEffect(() => {
  if (status === 'ready') {
    console.log("Client is ready!");
  }
}, [status]);
```

### Manual Refresh

```typescript
const { client, refresh } = useFhevmClient({
  provider: window.ethereum,
  chainId: 11155111
});

// Manually refresh the client
const handleRefresh = () => {
  refresh();
};
```

### Conditional Initialization

```typescript
const { client } = useFhevmClient({
  provider: window.ethereum,
  chainId: 11155111,
  enabled: isConnected // Only initialize when wallet is connected
});
```

### Multiple Encryptions

```typescript
const { encryptU32, encryptBool } = useEncrypt({
  client,
  contractAddress,
  userAddress
});

// Encrypt multiple values
const encrypted1 = await encryptU32(42);
const encrypted2 = await encryptBool(true);
```

### Batch Decryption

```typescript
const { userDecrypt } = useDecrypt({ client, signer });

// Decrypt multiple handles at once
const result = await userDecrypt([
  { handle: "0x123...", contractAddress: "0xabc..." },
  { handle: "0x456...", contractAddress: "0xabc..." },
  { handle: "0x789...", contractAddress: "0xdef..." }
]);

const value1 = result["0x123..."];
const value2 = result["0x456..."];
const value3 = result["0x789..."];
```

---

## Error Handling

### Client Not Ready

```typescript
try {
  const encrypted = await client.encryptU32(42, contract, user);
} catch (error) {
  if (error.message.includes("not ready")) {
    console.log("Client is not ready yet");
  }
}
```

### Network Errors

```typescript
const { client, error } = useFhevmClient({
  provider: window.ethereum,
  chainId: 11155111
});

if (error) {
  console.error("Failed to initialize:", error.message);
}
```

### Encryption Errors

```typescript
const { encryptU32, canEncrypt } = useEncrypt({
  client,
  contractAddress,
  userAddress
});

if (!canEncrypt) {
  console.log("Cannot encrypt: client, contract, or user not ready");
  return;
}

try {
  const encrypted = await encryptU32(42);
} catch (error) {
  console.error("Encryption failed:", error);
}
```

### Decryption Errors

```typescript
const { userDecrypt } = useDecrypt({ client, signer });

try {
  const result = await userDecrypt([{ handle, contractAddress }]);
} catch (error) {
  if (error.message.includes("signature")) {
    console.log("User rejected signature request");
  } else {
    console.error("Decryption failed:", error);
  }
}
```

---

## Best Practices

### 1. Check Client Status

Always check if the client is ready before using:

```typescript
const { client, status } = useFhevmClient({...});

if (status !== 'ready' || !client) {
  return <div>Loading...</div>;
}

// Now safe to use client
```

### 2. Use Type-Specific Methods

Prefer type-specific methods over generic `encrypt()`:

```typescript
// ✅ Good
const encrypted = await encryptU32(42);

// ❌ Less clear
const encrypted = await encrypt(42, "uint32");
```

### 3. Handle Errors Gracefully

Always wrap async operations in try-catch:

```typescript
try {
  const encrypted = await encryptU32(42);
  const tx = await contract.method(encrypted.handles[0], encrypted.inputProof);
  await tx.wait();
} catch (error) {
  console.error("Operation failed:", error);
  // Show user-friendly error message
}
```

### 4. Use Loading States

Show loading states for better UX:

```typescript
const { isDecrypting } = useDecrypt({...});

<button disabled={isDecrypting}>
  {isDecrypting ? 'Decrypting...' : 'Decrypt'}
</button>
```

### 5. Cache Signatures

The SDK automatically caches EIP-712 signatures. First decrypt requires signature, subsequent decrypts are instant:

```typescript
// First call: User signs (5-10 seconds)
const result1 = await userDecrypt([{ handle, contractAddress }]);

// Second call: Uses cached signature (instant)
const result2 = await userDecrypt([{ handle, contractAddress }]);
```

---

## Network Configuration

### Sepolia Testnet (Production)

```typescript
const client = await FhevmClient.create({
  provider: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  chainId: 11155111
});
```

### With MetaMask

```typescript
const { client } = useFhevmClient({
  provider: window.ethereum,
  chainId: 11155111
});
```

### With Custom Provider

```typescript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');

const client = await FhevmClient.create({
  provider: provider,
  chainId: 11155111
});
```

---

## TypeScript Support

The SDK is fully typed with TypeScript:

```typescript
import type {
  FhevmClient,
  FhevmConfig,
  FhevmStatus,
  EncryptedInput,
  DecryptRequest,
  DecryptResult,
  FhevmType
} from '@fhevm-sdk';

// All types are exported and available
```

---

## Package Exports

The SDK provides multiple entry points:

```typescript
// Main entry (includes everything)
import { FhevmClient, useFhevmClient } from '@fhevm-sdk';

// Core only (framework-agnostic)
import { FhevmClient } from '@fhevm-sdk/core';

// React hooks only
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm-sdk/react';

// Types only
import type { FhevmConfig, EncryptedInput } from '@fhevm-sdk/types';

// Storage utilities
import { GenericStringStorage } from '@fhevm-sdk/storage';
```

---

## Examples

### Complete Counter Example (React)

```typescript
import { useFhevmClient, useEncrypt, useDecrypt } from '@fhevm-sdk';
import { useState } from 'react';

function Counter() {
  const [value, setValue] = useState<number>(0);

  const { client, status } = useFhevmClient({
    provider: window.ethereum,
    chainId: 11155111
  });

  const { encryptU32, canEncrypt } = useEncrypt({
    client,
    contractAddress: "0x...",
    userAddress: "0x..."
  });

  const { userDecrypt, isDecrypting } = useDecrypt({
    client,
    signer
  });

  const increment = async () => {
    if (!canEncrypt) return;
    
    const encrypted = await encryptU32(1);
    const tx = await contract.increment(encrypted.handles[0], encrypted.inputProof);
    await tx.wait();
  };

  const decrypt = async () => {
    const handle = await contract.getCounterHandle();
    const result = await userDecrypt([{ handle, contractAddress }]);
    setValue(Number(result[handle]));
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (!client) return null;

  return (
    <div>
      <button onClick={increment} disabled={!canEncrypt}>
        Increment
      </button>
      <button onClick={decrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
      <div>Value: {value}</div>
    </div>
  );
}
```

### Complete Counter Example (Node.js)

```typescript
import { FhevmClient } from '@fhevm-sdk/core';
import { ethers } from 'ethers';

async function main() {
  // Initialize
  const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  const client = await FhevmClient.create({
    provider: provider,
    chainId: 11155111
  });

  // Contract
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Encrypt and increment
  const encrypted = await client.encryptU32(1, contractAddress, userAddress);
  const tx = await contract.increment(encrypted.handles[0], encrypted.inputProof);
  await tx.wait();

  // Decrypt
  const handle = await contract.getCounterHandle();
  const result = await client.userDecrypt([{ handle, contractAddress }], signer);
  console.log("Counter value:", result[handle]);
}

main();
```

---

## Migration from Old API

See [Migration Guide](./docs/guides/MIGRATION_GUIDE.md) for detailed migration instructions.

**Quick comparison**:

**Old API**:
```typescript
const { instance } = useFhevm({...});
const input = instance.createEncryptedInput(contract, user);
input.add32(value);
const encrypted = await input.encrypt();
```

**New API**:
```typescript
const { encryptU32 } = useEncrypt({...});
const encrypted = await encryptU32(value);
```

**Result**: 37% less code, clearer intent.

---

## Troubleshooting

See [Troubleshooting Guide](./docs/guides/TROUBLESHOOTING.md) for common issues and solutions.

**Common issues**:
- Client not ready
- Network connection errors
- Signature rejection
- Invalid contract address

---

## Links

- [Main README](./README.md) - Project overview
- [Quick Start](./QUICK_START.md) - Get started quickly
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Development workflow
- [Migration Guide](./docs/guides/MIGRATION_GUIDE.md) - Migrate from old API
- [Troubleshooting](./docs/guides/TROUBLESHOOTING.md) - Common issues
- [Examples](./examples/) - Working examples

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Last Updated**: October 22, 2025  
**Version**: 0.1.0  
**Status**: Production Ready

