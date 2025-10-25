# Changelog

All notable changes to the Universal FHEVM SDK project.

## [0.1.0] - 2025-01-23

### Added
- **Framework-Agnostic Core SDK** - Pure TypeScript core that works in any JavaScript environment
- **React Hooks** - `useFhevmClient`, `useEncrypt`, `useDecrypt` with Wagmi-like API
- **Real FHEVM Mock Support** - Works on localhost Hardhat with actual encryption/decryption
- **Sepolia Testnet Support** - Production-ready deployment on Sepolia
- **EIP-712 Signatures** - Secure user decryption with wallet signatures
- **IndexedDB Caching** - Efficient storage for encryption keys and signatures
- **Comprehensive Tests** - Unit, integration, and E2E tests with >80% coverage
- **TypeScript Support** - Full type safety with auto-completion
- **Next.js Showcase** - Modern demo app with Zama design system

### Fixed
- **Signer Conversion** - Proper async handling for viem to ethers.js conversion
- **Stale Handle Issue** - Automatic refetch of encrypted handles after transactions
- **Transaction Monitoring** - Reliable transaction receipt waiting with `useWaitForTransactionReceipt`
- **Cache Invalidation** - Clear decrypted values when counter changes

### Changed
- **Moved Dependencies** - `@zama-fhe/relayer-sdk` and `ethers` from peer to regular dependencies
- **Improved Error Handling** - Better error messages with context
- **Enhanced Logging** - Comprehensive debug logging for troubleshooting

### Documentation
- Complete API documentation
- Quick start guide
- Development guide
- Sepolia setup guide
- Contributing guidelines

---

## Future Releases

### Planned for 0.2.0
- Vue.js composables
- Angular services
- Svelte stores
- CLI tool for quick setup
- More encryption types (euint64, euint128, etc.)
- Batch encryption/decryption
- Performance optimizations

### Planned for 1.0.0
- Stable API
- Production-ready
- Full documentation
- Video tutorials
- Community examples
