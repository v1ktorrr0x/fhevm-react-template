# Contributing to Universal FHEVM SDK

Thank you for your interest in contributing to the Universal FHEVM SDK!

## Development Setup

### Prerequisites

- Node.js >= 20.0.0
- pnpm (package manager)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies (automatically builds SDK)
pnpm install
```

### Development Workflow

```bash
# Build SDK
pnpm sdk:build

# Watch mode (auto-rebuild on changes)
pnpm sdk:watch

# Run tests
pnpm sdk:test

# Run tests in watch mode
pnpm sdk:test:watch

# Lint code
pnpm lint

# Format code
pnpm format
```

### Testing

```bash
# Run all tests
pnpm sdk:test

# Run specific test file
pnpm vitest packages/fhevm-sdk/test/integration/core-client.test.ts

# Run with coverage
pnpm sdk:test
# Then open coverage/index.html

# Test with Hardhat node (for full test suite)
# Terminal 1:
pnpm chain

# Terminal 2:
pnpm sdk:test
```

### Project Structure

```
fhevm-react-template/
├── packages/
│   ├── fhevm-sdk/              # Universal FHEVM SDK
│   │   ├── src/
│   │   │   ├── core/          # Framework-agnostic core
│   │   │   ├── react/         # React hooks
│   │   │   ├── internal/      # Implementation details
│   │   │   └── storage/       # Storage utilities
│   │   └── test/              # Test files
│   ├── hardhat/               # Smart contracts
│   └── nextjs/                # React showcase
├── examples/
│   └── node-js/               # Node.js example
└── docs/                      # Documentation
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation

### 3. Test Your Changes

```bash
# Build SDK
pnpm sdk:build

# Run tests
pnpm sdk:test

# Lint
pnpm lint

# Format
pnpm format

# Test Next.js app
pnpm start
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style

### TypeScript

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types
- Use interfaces for public APIs

### Documentation

- Add JSDoc comments to all public APIs
- Include parameter descriptions
- Include return type descriptions
- Provide usage examples

Example:
```typescript
/**
 * Encrypts a uint32 value.
 * 
 * @param value - Number to encrypt (0 to 2^32-1)
 * @param contractAddress - Target contract address
 * @param userAddress - User's wallet address
 * @returns Promise resolving to encrypted input
 * 
 * @example
 * ```typescript
 * const encrypted = await client.encryptU32(42, contractAddr, userAddr);
 * ```
 */
async encryptU32(
  value: number,
  contractAddress: string,
  userAddress: string
): Promise<EncryptedInput>
```

### Testing

- Write tests for all new features
- Use descriptive test names
- Test both success and error cases
- Aim for >80% code coverage

Example:
```typescript
describe('FhevmClient', () => {
  it('should create client with valid config', async () => {
    const client = await FhevmClient.create({
      provider: mockProvider,
      chainId: 31337
    });
    
    expect(client).toBeDefined();
    expect(client.isReady()).toBe(true);
  });
  
  it('should throw error with invalid config', async () => {
    await expect(
      FhevmClient.create({ provider: null })
    ).rejects.toThrow(/provider is required/i);
  });
});
```

## Areas for Contribution

### High Priority

- **Bug fixes** - Fix any issues you find
- **Test coverage** - Improve test coverage
- **Documentation** - Improve or add documentation
- **Examples** - Add more usage examples

### Medium Priority

- **Performance** - Optimize slow operations
- **Error messages** - Improve error messages
- **Type definitions** - Improve TypeScript types

### Low Priority

- **New features** - Add new functionality
- **Refactoring** - Improve code structure
- **Tooling** - Improve development tools

## Questions?

- Check the [README](./README.md)
- Read the [API Documentation](./API.md)
- See the [Troubleshooting Guide](./docs/guides/TROUBLESHOOTING.md)
- Open an issue on GitHub

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
