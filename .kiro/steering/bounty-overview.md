# Bounty Challenge: Universal FHEVM SDK

## Challenge Details

**Prize Pool**: $10,000 ($5,000 / $3,000 / $2,000)  
**Deadline**: October 31, 2025 (23:59 AOE)  
**Start Date**: October 8, 2025

## Objective

Build a universal, framework-agnostic FHEVM SDK that makes building confidential frontends simple, consistent, and developer-friendly.

## Core Requirements

### 1. Universal SDK Package (fhevm-sdk)
- Framework-agnostic (works in Node.js, Next.js, Vue, React, any frontend)
- Wrapper around all required packages (single dependency for developers)
- Wagmi-like modular API structure
- Core logic independent from framework-specific adapters

### 2. Essential Features
- Initialization utilities
- Encrypted inputs handling
- Decryption flows:
  - `userDecrypt` with EIP-712 signing
  - `publicDecrypt`
- Reusable components for different encryption/decryption scenarios
- Clean, reusable, and extensible architecture

### 3. Developer Experience
- Install all packages from root
- Compile, deploy, and generate ABI from Solidity contract
- Start frontend template from root
- Minimal boilerplate (<10 lines of code to get started)

## Deliverables

1. GitHub repo (must be a fork of fhevm-react-template with commit history)
2. Next.js showcase (required)
3. Video walkthrough of setup and design choices
4. Deployment link(s) in README
5. Optional: Additional framework examples (Vue, plain Node.js)

## Judging Criteria (Priority Order)

1. **Usability** (30%) - Easy installation, minimal boilerplate, quick setup
2. **Completeness** (25%) - Full FHEVM flow coverage (init, encrypt, decrypt, contract interaction)
3. **Reusability** (20%) - Clean, modular, adaptable across frameworks
4. **Documentation & Clarity** (15%) - Well-documented with clear examples
5. **Creativity** (10%) - Multiple environments, innovative use cases

## Important Notes

- Focus on `packages/fhevm-sdk` - Next.js is just a showcase
- Must be a fork (preserving commit history) - non-forks disqualified
- Can delete/rebuild everything, but keep commit history
- Follow Zama's official SDKs and guidelines
- Check GitHub issues for inspiration and community feedback

## Bonus Points (Optional)

- SDK working in multiple environments (Vue, Node.js, Next.js)
- Clear documentation and code samples
- Developer-friendly CLI with <10 lines setup
