# Bounty Development Workflow

## Development Priorities

### Phase 1: Core SDK (HIGHEST PRIORITY)
Focus 70% of effort here - this is what judges will evaluate most.

1. Design framework-agnostic core API
2. Implement initialization utilities
3. Build encrypted input handling
4. Create decryption flows (userDecrypt + publicDecrypt)
5. Write comprehensive tests
6. Document all public APIs

### Phase 2: React Showcase (REQUIRED)
Focus 20% of effort here - demonstrates SDK usage.

1. Update Next.js template to use new SDK
2. Create example components showing all features
3. Ensure clean, minimal code examples
4. Deploy to Vercel or similar platform

### Phase 3: Documentation (REQUIRED)
Focus 10% of effort here - critical for usability score.

1. README with quick start guide
2. API documentation
3. Code examples for common scenarios
4. Video walkthrough (required deliverable)

### Phase 4: Bonus Features (OPTIONAL)
Only if time permits - don't sacrifice core quality.

1. Vue.js example
2. Plain Node.js example
3. Additional creative use cases

## Testing Strategy

### Unit Tests (Vitest)
- Core encryption/decryption logic
- Initialization flows
- Error handling
- Type safety

### Integration Tests
- Full encrypt → contract call → decrypt flow
- Multi-network support
- Cache behavior

### Manual Testing
- Test in Next.js showcase
- Verify developer experience (<10 lines setup)
- Check error messages are helpful

## Documentation Checklist

### README.md Must Include:
- [ ] Quick start (installation + basic usage)
- [ ] Link to deployed demo
- [ ] Link to video walkthrough
- [ ] Architecture overview
- [ ] API reference or link to docs
- [ ] Examples for common use cases
- [ ] Troubleshooting section

### Code Documentation:
- [ ] JSDoc comments on all public APIs
- [ ] Type definitions with descriptions
- [ ] Inline comments for complex logic
- [ ] Example code in comments

### Video Walkthrough Should Cover:
- [ ] Installation process
- [ ] Basic setup (<10 lines demo)
- [ ] Key design decisions
- [ ] Architecture explanation
- [ ] Live demo of encryption/decryption
- [ ] Showcase of reusability across frameworks (if applicable)

## Common Commands for Development

```bash
# SDK development
pnpm sdk:build        # Build after changes
pnpm sdk:watch        # Auto-rebuild during development
pnpm sdk:test         # Run tests before committing
pnpm sdk:clean        # Clean when switching branches

# Full workflow
pnpm install          # Builds SDK automatically
pnpm chain            # Start local node (Terminal 1)
pnpm deploy:localhost # Deploy contracts (Terminal 2)
pnpm generate         # Generate TypeScript ABIs
pnpm start            # Start Next.js showcase (Terminal 3)

# Before submission
pnpm lint             # Check code quality
pnpm format           # Format all code
pnpm test             # Run all tests
pnpm next:build       # Verify production build works
```

## Pre-Submission Checklist

- [ ] SDK is framework-agnostic (core has no React/Vue deps)
- [ ] Wagmi-like API structure implemented
- [ ] All encryption/decryption flows working
- [ ] Tests passing with good coverage
- [ ] Next.js showcase deployed and linked in README
- [ ] Video walkthrough recorded and linked
- [ ] Documentation complete and clear
- [ ] Code is clean, formatted, and linted
- [ ] Repo is a fork with commit history preserved
- [ ] All deliverables listed in bounty requirements included

## Submission Deadline

**October 31, 2025 (23:59 AOE)**

Plan to finish 2-3 days early to allow time for:
- Final testing
- Documentation review
- Video recording and editing
- Deployment verification
