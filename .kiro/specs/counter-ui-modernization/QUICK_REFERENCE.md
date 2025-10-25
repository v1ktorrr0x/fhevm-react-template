# FHECounter UI - Quick Reference Card

## 🎨 Design Tokens

### Colors
```typescript
Primary:    #FED209  // Zama Yellow
Background: rgba(0,0,0,0.6) + blur(20px)
Border:     rgba(254,210,9,0.08-0.15)
Text:       #ffffff, #9ca3af, #6b7280
```

### Spacing
```typescript
Section:  p-8 (32px) / p-6 (24px)
Item:     p-4 (16px)
Gap:      gap-8 (32px) / gap-6 (24px)
Margin:   mb-12 (48px) / mb-8 (32px)
```

### Typography
```typescript
Counter:  text-9xl (96px) → text-8xl (64px) mobile
Heading:  text-3xl (24px) → text-xl (20px)
Body:     text-sm (14px)
Label:    text-xs (12px)
```

## 🏗️ Layout Structure

```
┌─────────────────────────────────────┐
│           HEADER (full)             │
├─────────────────┬───────────────────┤
│   COUNTER (7)   │  STATUS (5)       │
│                 │                   │
│   • Value       │  • FHEVM Client   │
│   • Handle      │  • Encryption     │
│   • Buttons     │  • Contract       │
│                 │  • Info           │
├─────────────────┴───────────────────┤
│         FEATURES (full)             │
└─────────────────────────────────────┘
```

## 🎯 Key Classes

### Container
```typescript
unifiedContainerClass
// Single glassmorphic surface
```

### Sections
```typescript
sectionClass        // Main sections (p-8)
compactSectionClass // Sidebar sections (p-6)
```

### Items
```typescript
statusItemClass  // Status indicators
infoRowClass     // Info rows
```

### Buttons
```typescript
primaryButtonClass   // Yellow filled
secondaryButtonClass // Yellow outlined
```

## 🔧 Component Props

### Main Component
```typescript
// No props - self-contained
<FHECounterDemo />
```

### Key State
```typescript
isConnected      // Wallet connection
isSupportedNetwork // Network check
isReady          // SDK ready
isProcessing     // Transaction pending
isDecrypting     // Decryption in progress
decryptedValue   // Counter value
```

## 📱 Responsive Behavior

### Desktop (>1024px)
- Two-column layout (7:5)
- Vertical divider between columns
- Full spacing and padding

### Mobile (<768px)
- Single column stack
- Reduced padding (p-8 → p-4)
- Smaller counter (96px → 64px)
- Full-width buttons

## 🎭 Animations

### Entrance
```typescript
Header:    0.3s delay
Counter:   0.4s delay
Status:    0.4s + 0.1s
Info:      0.4s + 0.2s
Features:  0.4s + 0.3s (staggered)
```

### Interactions
```typescript
Hover:  scale(1.05) + translateY(-2px)
Active: scale(1.02)
Focus:  ring-3 ring-[#FED209]
```

## 🐛 Debugging

### Console Output
```typescript
// Warnings only
"[FHECounter] Unsupported network detected"

// Errors only
"[FHECounter] FHEVM Client Error"
"[FHECounter] Increment failed"
"[FHECounter] Decrement failed"
"[FHECounter] Decrypt failed"
```

### No Logging For
- ❌ Component renders
- ❌ State changes
- ❌ Successful operations
- ❌ Hook updates

## 🔍 Common Issues

### Counter not updating?
- Check network connection
- Verify contract is deployed
- Check FHEVM client status

### Buttons disabled?
- Wait for `isReady` state
- Check wallet connection
- Verify supported network

### Decrypt not working?
- Ensure handle exists
- Check signer is available
- Verify contract address

## 📦 File Locations

```
Main Component:
packages/nextjs/app/_components/FHECounterDemo.tsx

Backup:
packages/nextjs/app/_components/FHECounterDemo.backup.tsx

Styles:
packages/nextjs/styles/globals.css

Docs:
.kiro/specs/counter-ui-modernization/
```

## 🚀 Quick Commands

```bash
# Start dev server
pnpm start

# Deploy locally
pnpm deploy:localhost

# Deploy to Sepolia
pnpm deploy:sepolia

# Generate ABIs
pnpm generate

# Lint
pnpm lint

# Format
pnpm format
```

## ✅ Checklist

### Before Deployment
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] All buttons work
- [ ] Responsive on mobile
- [ ] Accessible with keyboard
- [ ] Animations smooth (60fps)

### After Deployment
- [ ] Test on real network
- [ ] Verify wallet connection
- [ ] Test all operations
- [ ] Check mobile experience
- [ ] Monitor console for errors

## 📞 Support

### Documentation
- requirements.md - Requirements
- design.md - Design specs
- tasks.md - Implementation tasks
- FINAL_SUMMARY.md - Complete overview

### Key Concepts
- Unified surface design
- Flush aesthetics
- Subtle separators
- Left border accents
- Cohesive flow
