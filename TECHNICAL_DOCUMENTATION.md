# Technical Documentation

## Architecture Overview

The FHE Counter is a decentralized application implementing Fully Homomorphic Encryption (FHE) on Ethereum using Zama's FHEVM technology.

### Technology Stack

**Smart Contract Layer:**
- Solidity ^0.8.24
- FHEVM (Zama)
- Hardhat Development Environment

**Frontend Layer:**
- Next.js 15.2.5
- React 18
- TypeScript
- Wagmi + Viem
- TailwindCSS
- FHEVM SDK

**Development Tools:**
- pnpm (Package Manager)
- Hardhat (Smart Contract Development)
- TypeScript (Type Safety)

## Smart Contract Architecture

### FHECounter.sol

```solidity
contract FHECounter is SepoliaConfig {
    // State Variables
    euint32 private _count;      // Encrypted counter
    address public owner;         // Contract owner
    bool public paused;          // Pause state
    
    // Core Functions
    function increment(externalEuint32, bytes calldata) external;
    function decrement(externalEuint32, bytes calldata) external;
    function getCount() external view returns (euint32);
    
    // Administrative Functions
    function pause() external onlyOwner;
    function unpause() external onlyOwner;
    function transferOwnership(address) external onlyOwner;
}
```

### Security Implementation

#### Overflow/Underflow Protection
```solidity
euint32 newCount = FHE.add(_count, encryptedEuint32);
ebool isOverflow = FHE.lt(newCount, _count);
FHE.req(FHE.not(isOverflow));
```

#### Access Control
```solidity
modifier onlyOwner() {
    if (msg.sender != owner) revert Unauthorized();
    _;
}
```

#### Pause Mechanism
```solidity
modifier whenNotPaused() {
    if (paused) revert ContractPaused();
    _;
}
```

### Gas Consumption

| Operation | Gas Cost |
|-----------|----------|
| increment() | ~195,000 |
| decrement() | ~195,000 |
| pause() | ~45,000 |
| unpause() | ~45,000 |
| transferOwnership() | ~50,000 |
| getCount() | ~50,000 (view) |

## Frontend Architecture

### Component Structure

```
FHECounterDemo (Main Component)
├── LoadingSpinner (Memoized)
├── CounterDisplay (Memoized)
├── StatusIndicator (Memoized)
├── ActionButton (Memoized)
└── MessageAlert (Memoized)
```

### State Management

```typescript
// Core State
const [decryptedValue, setDecryptedValue] = useState<bigint | null>(null);
const [error, setError] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [isIncrementLoading, setIsIncrementLoading] = useState(false);
const [isDecrementLoading, setIsDecrementLoading] = useState(false);
const [isAutoDecrypting, setIsAutoDecrypting] = useState(false);

// References for Asynchronous Operations
const autoDecryptTimerRef = useRef<NodeJS.Timeout | null>(null);
const isMountedRef = useRef(true);
```

### Data Flow

```
User Action
    ↓
Handler Function
    ↓
Encryption (FHEVM SDK) [2-5 seconds]
    ↓
Transaction Submission (Wagmi) [15-30 seconds]
    ↓
Automatic Decryption [2-3 seconds]
    ↓
UI Update
```

## Performance Characteristics

### Smart Contract

| Metric | Value |
|--------|-------|
| Deployment Gas | ~2,500,000 |
| Increment Gas | ~195,000 |
| Decrement Gas | ~195,000 |
| GetCount Gas | ~50,000 |

### Frontend

| Metric | Value |
|--------|-------|
| Initial Load | 2-3 seconds |
| Time to Interactive | 3-5 seconds |
| Bundle Size (gzipped) | ~850 KB |
| Encryption Time | 2-5 seconds |
| Transaction Time | 15-30 seconds |

## API Reference

### Smart Contract

#### Read Functions

```solidity
// Retrieve encrypted counter value
function getCount() external view returns (euint32)

// Retrieve contract owner address
function owner() public view returns (address)

// Retrieve pause status
function paused() public view returns (bool)
```

#### Write Functions

```solidity
// Increment counter
function increment(
    externalEuint32 inputEuint32,
    bytes calldata inputProof
) external whenNotPaused

// Decrement counter
function decrement(
    externalEuint32 inputEuint32,
    bytes calldata inputProof
) external whenNotPaused

// Pause contract operations (owner only)
function pause() external onlyOwner

// Resume contract operations (owner only)
function unpause() external onlyOwner

// Transfer contract ownership (owner only)
function transferOwnership(address newOwner) external onlyOwner
```

#### Events

```solidity
event CounterIncremented(address indexed user, uint256 timestamp);
event CounterDecremented(address indexed user, uint256 timestamp);
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
event Paused(address indexed account);
event Unpaused(address indexed account);
```

### Frontend Hooks

#### useFhevmClient
```typescript
const { client, status, error } = useFhevmClient({
  provider,
  chainId,
  mockChains,
  enabled: isConnected,
});
```

#### useEncrypt
```typescript
const { encryptU32, canEncrypt } = useEncrypt({
  client,
  contractAddress,
  userAddress: address,
});
```

#### useDecrypt
```typescript
const { userDecrypt, isDecrypting } = useDecrypt({
  client,
  signer,
});
```

## Testing

### Smart Contract Tests

```bash
# Execute all tests
pnpm hardhat:test

# Execute specific test
pnpm hardhat:test --grep "increment"

# Execute with gas reporting
REPORT_GAS=true pnpm hardhat:test
```

### Test Coverage

**Current Coverage:** Approximately 60%  
**Target Coverage:** 90%

## Debugging

### Enable Debug Logging

```typescript
// In FHECounterDemo.tsx
useEffect(() => {
  console.log('[FHECounter] Status:', {
    status,
    canEncrypt,
    contractAddress,
    isConnected,
    chainId,
  });
}, [status, canEncrypt, contractAddress, isConnected, chainId]);
```

### Common Issues

**FHEVM Client Initialization Failure**
```typescript
// Verify provider configuration
console.log('Provider:', provider);
console.log('Chain ID:', chainId);
console.log('Mock chains:', mockChains);
```

**Encryption Failure**
```typescript
// Verify encryption capability
console.log('Can encrypt:', canEncrypt);
console.log('Client status:', status);
```

**Transaction Failure**
```typescript
// Verify transaction parameters
console.log('Contract address:', contractAddress);
console.log('Contract ABI:', contractAbi);
console.log('Encrypted data:', encrypted);
```

## Best Practices

### Smart Contract Development

1. Validate all external inputs
2. Use custom errors for gas efficiency
3. Emit events for all state changes
4. Implement access control for administrative functions

### Frontend Development

1. Memoize components to prevent unnecessary re-renders
2. Use useCallback for event handlers
3. Provide immediate user feedback for actions
4. Handle errors with user-friendly messages

## System Limitations

### Technical Constraints
1. FHE encryption operations require 2-5 seconds
2. Gas costs for FHE operations: approximately 195,000 per transaction
3. Network support limited to Localhost and Sepolia
4. Bundle size: approximately 850 KB

### Functional Constraints
1. Single operation per transaction
2. No transaction history storage
3. Single owner model
4. Non-upgradeable contract architecture

## References

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)

---

**Last Updated:** October 27, 2025  
**Version:** 1.0.0
