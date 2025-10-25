# Design Document: FHECounter UI/UX Modernization

## Overview

This design document outlines a comprehensive UI/UX modernization plan for the FHECounter frontend demo. The focus is purely on visual design, component structure, interaction patterns, and user experience - **no changes to business logic, hooks, or SDK integration**. The modernization will transform the current single-file component into a modular, visually polished interface while maintaining Zama's distinctive brand identity.

### Design Goals

1. **Visual Excellence**: Create a stunning, modern interface that showcases Zama's brand
2. **Component Modularity**: Break down UI into focused, reusable visual components
3. **Smooth Interactions**: Add polished animations and micro-interactions
4. **Clear Hierarchy**: Improve information architecture and visual flow
5. **Responsive Design**: Ensure beautiful presentation across all devices
6. **Accessibility**: Make the UI usable for everyone

## Architecture

### Current State Analysis

**Visual Strengths:**
- Solid Zama brand implementation (black/yellow color scheme)
- Glassmorphism effects are well-executed
- Good use of animations (messageSlideIn)
- Clear status indicators with color coding
- Responsive layout adapts to mobile

**UI/UX Areas for Improvement:**
- **Component Organization**: 600+ lines in one file makes UI updates difficult
- **Visual Hierarchy**: Counter value could be more prominent
- **Interaction Feedback**: Button states could be more engaging
- **Animation Polish**: Could use more sophisticated transitions
- **Spacing**: Some sections feel cramped
- **Typography**: Could use more varied sizes for hierarchy
- **Loading States**: Could be more visually interesting
- **Mobile Experience**: Could optimize touch targets and spacing

### Proposed UI Component Structure

**Note**: This is a UI-only refactor. All business logic, hooks, and SDK integration remain in the main component. We're only extracting visual/presentational components.

```
packages/nextjs/app/_components/FHECounter/
├── FHECounterDemo.tsx                 # Main component (keeps all logic)
├── ui/                                # Pure UI components (no logic)
│   ├── ConnectionPrompt.tsx           # Wallet connection screen UI
│   ├── NetworkError.tsx               # Wrong network screen UI
│   ├── StatusPanel.tsx                # System status display UI
│   ├── StatusCard.tsx                 # Individual status item UI
│   ├── CounterDisplay.tsx             # Main counter visualization UI
│   ├── EncryptedHandle.tsx            # Handle display UI
│   ├── ActionButtons.tsx              # Button group UI
│   ├── PrimaryButton.tsx              # Primary button UI
│   ├── SecondaryButton.tsx            # Secondary button UI
│   ├── ContractInfo.tsx               # Contract details panel UI
│   ├── InfoRow.tsx                    # Individual info row UI
│   ├── FeatureCards.tsx               # Feature highlights grid UI
│   ├── FeatureCard.tsx                # Individual feature card UI
│   ├── ErrorDisplay.tsx               # Error message UI
│   ├── DemoHeader.tsx                 # Demo header UI
│   └── index.ts                       # Export all UI components
└── styles/
    ├── theme.ts                       # Design tokens (colors, spacing, etc.)
    ├── animations.ts                  # Animation configurations
    └── index.ts
```

**Key Principle**: UI components are **presentational only** - they receive props and render JSX. All state, effects, and business logic stays in `FHECounterDemo.tsx`.

## UI Components and Interfaces

### Design Philosophy

All components in the `ui/` folder are **pure presentational components**:
- ✅ Receive data via props
- ✅ Render JSX with styling
- ✅ Handle UI events (onClick, onHover)
- ❌ No useState, useEffect, or custom hooks
- ❌ No business logic or data fetching
- ❌ No direct SDK/wagmi integration

### 1. Main Component (FHECounterDemo.tsx)

**Purpose**: Orchestrate UI components and manage all application logic

**Responsibilities**:
- Keep all existing hooks and state management
- Keep all business logic (increment, decrement, decrypt)
- Render appropriate UI components based on state
- Pass data and handlers to UI components as props

### 2. ConnectionPrompt Component (UI Only)

**Purpose**: Display wallet connection screen with clear call-to-action

**Props Interface**:
```typescript
interface ConnectionPromptProps {
  onConnect?: () => void; // Optional, for custom connect logic
  className?: string;
}
```

**Visual Design**:
- Centered layout with glassmorphic card (max-width: 480px)
- Animated Zama logo icon (64px × 64px, yellow filter)
- Heading: "Wallet Not Connected" (32px, bold)
- Description: Clear messaging about FHE capabilities (16px, gray)
- Connect button: RainbowKitCustomConnectButton (prominent placement)
- Entrance animation: slideIn from bottom (400ms)

**Visual Hierarchy**:
1. Icon (primary focus, yellow accent)
2. Heading (white, bold)
3. Description text (gray-400)
4. Connect button (yellow, large)

### 3. NetworkError Component (UI Only)

**Purpose**: Guide users to switch to supported networks

**Props Interface**:
```typescript
interface NetworkErrorProps {
  supportedNetworks: Array<{ name: string; chainId: number }>;
  currentChainId?: number;
  deploymentInstructions?: { network: string; command: string };
  className?: string;
}
```

**Visual Design**:
- Centered card layout (max-width: 480px)
- Error icon: X in red circle (64px, red-400)
- Heading: "Unsupported Network" (32px, bold, white)
- Description: "Please switch to..." (16px, gray-400)
- Network list: Glassmorphic container with yellow bullet points
- Each network: Yellow square bullet + network name + chain ID
- Connect button below for network switching
- Deployment instructions: Yellow code block (if applicable)

### 4. StatusPanel Component (UI Only)

**Purpose**: Display real-time system status with visual indicators

**Props Interface**:
```typescript
interface StatusPanelProps {
  statuses: Array<{
    label: string;
    state: 'idle' | 'loading' | 'ready' | 'error';
    icon?: React.ReactNode;
  }>;
  errors?: Array<{ type: string; message: string }>;
  warnings?: Array<{ type: string; message: string }>;
  className?: string;
}
```

**Visual Design**:
- Glassmorphic card container
- Heading: "System Status" with yellow bullet (20px, bold)
- Grid layout: 3 columns desktop, 1 column mobile (gap: 16px)
- Each status uses StatusCard component
- Error messages below grid (if any)
- Warning messages below errors (if any)
- Entrance animation: slideIn with 0ms delay

**Color Coding**:
- Yellow (#FED209) + solid dot: Ready
- Gray (#6B7280) + solid dot: Idle/Not Ready  
- Red (#EF4444) + solid dot: Error
- Amber (#FBBF24) + pulsing dot: Loading

### 5. CounterDisplay Component (UI Only)

**Purpose**: Showcase the encrypted counter value with engaging visuals

**Props Interface**:
```typescript
interface CounterDisplayProps {
  value: bigint | null;
  encryptedHandle: string | null;
  isDecrypting?: boolean;
  className?: string;
}
```

**Visual Design**:
- Glassmorphic container with yellow border glow
- Padding: 48px (desktop), 32px (mobile)
- Heading: "Encrypted Counter" with yellow bullet (20px, bold)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│  ● Encrypted Counter                │
│                                     │
│       Current Value                 │
│                                     │
│          ???                        │
│      (or actual value)              │
│                                     │
│  Handle: 0x1234...5678              │
│                                     │
│  ● Click Decrypt to reveal value    │
└─────────────────────────────────────┘
```

**Typography**:
- "Current Value" label: 12px, uppercase, gray-400, tracking-wider
- Counter value: 72px, bold, yellow, mono font, center-aligned
- Handle label: 12px, gray-600
- Handle value: 12px, yellow, mono font
- Instruction text: 14px, gray-400, with yellow pulsing dot

**Animations**:
- Value change: Fade out old → fade in new (300ms)
- Decrypting state: Pulsing opacity on value (1s loop)

### 6. ActionButtons Component (UI Only)

**Purpose**: Provide intuitive controls for counter operations

**Props Interface**:
```typescript
interface ActionButtonsProps {
  onDecrypt: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  isDecrypting?: boolean;
  isProcessing?: boolean;
  isReady?: boolean;
  hasHandle?: boolean;
  className?: string;
}
```

**Visual Design**:
- Flexbox layout: row, center-aligned, gap: 16px, wrap on mobile
- Three buttons using PrimaryButton and SecondaryButton components

**Button Configuration**:
1. **Decrypt** (Primary):
   - Yellow background (#FED209), black text
   - Disabled if: !hasHandle || isDecrypting || !isReady
   - Shows "Decrypting..." text when isDecrypting
   - Icon: Lock/unlock icon (optional)

2. **Increment** (Secondary):
   - Outlined yellow, hover fills yellow
   - Disabled if: !isReady || isProcessing
   - Shows "Processing..." when isProcessing
   - Icon: Plus icon

3. **Decrement** (Secondary):
   - Outlined yellow, hover fills yellow
   - Disabled if: !isReady || isProcessing
   - Shows "Processing..." when isProcessing
   - Icon: Minus icon

**Interaction States** (all buttons):
- Default: Ready, subtle shadow
- Hover: scale(1.05) + translateY(-2px), stronger shadow
- Active: scale(1.02), no translateY
- Disabled: opacity(0.5), cursor-not-allowed, no hover effects
- Loading: Spinner animation (16px), disabled

### 7. ContractInfo Component

**Purpose**: Display contract and network information

**Design Features**:
- Collapsible panel (optional enhancement)
- InfoRow components for each data point
- Monospace font for addresses
- Copy-to-clipboard functionality (optional)
- Responsive layout (stacks on mobile)

**Information Displayed**:
- Contract Address
- Network Name & Chain ID
- User Address

### 8. FeatureCards Component

**Purpose**: Highlight key SDK features

**Design Features**:
- 3-column grid (responsive to 1 column on mobile)
- Individual FeatureCard components
- Hover effects with border glow
- Icon + title + description layout
- Staggered entrance animations

**Features Highlighted**:
1. Framework-Agnostic
2. Wagmi-Like API
3. Type-Safe

### 9. ErrorDisplay Component

**Purpose**: Show error messages with clear visual distinction

**Design Features**:
- Red-tinted glassmorphic container
- Error icon
- Bold error label
- Detailed error message
- Optional dismiss button
- Slide-in animation

### 10. DemoHeader Component

**Purpose**: Provide context and branding for the demo

**Design Features**:
- Zama logo with yellow filter
- Title and subtitle
- Network indicator badge
- Wallet connection button
- Responsive layout (stacks on mobile)

## Data Models

### Counter State Interface

```typescript
interface CounterState {
  // Values
  encryptedHandle: string | null;
  decryptedValue: bigint | null;
  
  // Status
  isProcessing: boolean;
  isDecrypting: boolean;
  isReady: boolean;
  
  // Errors
  error: string | null;
  clientError: Error | null;
  
  // Network
  chainId: number | undefined;
  isLocalhost: boolean;
  isSepolia: boolean;
  isSupportedNetwork: boolean;
  
  // Contract
  contractAddress: string | undefined;
  contractAbi: any;
}
```

### Action Handlers Interface

```typescript
interface CounterActions {
  handleIncrement: () => Promise<void>;
  handleDecrement: () => Promise<void>;
  handleDecrypt: () => Promise<void>;
  clearError: () => void;
}
```

### Status Types

```typescript
type StatusState = 'idle' | 'loading' | 'ready' | 'error';

interface StatusCardProps {
  label: string;
  status: StatusState;
  icon?: React.ReactNode;
}
```

## Error Handling

### Error Display Strategy

1. **Client Errors**: Display in StatusPanel with red indicator
2. **Action Errors**: Display in ErrorDisplay component below StatusPanel
3. **Network Errors**: Show NetworkError screen
4. **Contract Errors**: Display in StatusPanel with warning message

### Error Message Formatting

```typescript
interface ErrorMessage {
  type: 'client' | 'action' | 'network' | 'contract';
  title: string;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
}
```

## Testing Strategy

### Component Testing

1. **Unit Tests**: Test each component in isolation
   - Props rendering
   - Event handlers
   - Conditional rendering
   - Accessibility attributes

2. **Integration Tests**: Test component interactions
   - State management flow
   - Action handler execution
   - Error propagation
   - Animation sequences

3. **Visual Regression Tests**: Ensure design consistency
   - Screenshot comparisons
   - Responsive breakpoints
   - Theme variations

### Testing Tools

- **Vitest**: Unit and integration tests
- **React Testing Library**: Component testing
- **Playwright** (optional): E2E testing

## Design System

### Color Palette

```typescript
const colors = {
  // Primary
  zamaYellow: '#FED209',
  black: '#000000',
  
  // Backgrounds
  bgPrimary: '#000000',
  bgSecondary: '#111111',
  bgTertiary: '#1a1a1a',
  
  // Glassmorphism
  glassLight: 'rgba(255, 255, 255, 0.08)',
  glassDark: 'rgba(0, 0, 0, 0.4)',
  
  // Borders
  borderYellow: 'rgba(254, 210, 9, 0.25)',
  borderYellowHover: 'rgba(254, 210, 9, 0.4)',
  borderYellowLight: 'rgba(254, 210, 9, 0.15)',
  
  // Status
  success: '#34eeb6',
  warning: '#ffcf72',
  error: '#EF4444',
  info: '#93bbfb',
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
};
```

### Typography Scale

```typescript
const typography = {
  // Display
  displayLarge: '72px',    // Counter value
  displayMedium: '48px',   // Large headings
  
  // Headings
  h1: '32px',
  h2: '24px',
  h3: '20px',
  h4: '18px',
  
  // Body
  bodyLarge: '16px',
  bodyMedium: '14px',
  bodySmall: '12px',
  
  // Mono
  mono: '"Courier New", monospace',
  
  // Weights
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};
```

### Spacing System

```typescript
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};
```

### Animation Configurations

```typescript
const animations = {
  // Durations
  fast: '200ms',
  normal: '300ms',
  slow: '400ms',
  
  // Easings
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  
  // Transforms
  scaleHover: 'scale(1.05)',
  scaleActive: 'scale(1.02)',
  translateUp: 'translateY(-2px)',
  
  // Keyframes
  slideIn: {
    from: { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
    to: { opacity: 1, transform: 'translateY(0) scale(1)' },
  },
  pulse: {
    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
    '50%': { opacity: 0.7, transform: 'scale(1.05)' },
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};
```

### Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};
```

## Implementation Phases

### Phase 1: Foundation (Non-Breaking)

1. Create new component directory structure
2. Extract style definitions to separate files
3. Create TypeScript interfaces
4. Set up utility functions
5. **Keep existing FHECounterDemo.tsx as-is**

### Phase 2: Component Extraction

1. Create ConnectionPrompt component
2. Create NetworkError component
3. Create StatusPanel and StatusCard components
4. Create CounterDisplay component
5. Create ActionButtons components
6. Test each component in isolation

### Phase 3: Integration

1. Create main orchestrator component
2. Wire up all sub-components
3. Implement state management hooks
4. Add error handling
5. Test full integration

### Phase 4: Enhancement

1. Add animations and transitions
2. Implement responsive improvements
3. Add accessibility features
4. Optimize performance
5. Add documentation

### Phase 5: Migration

1. Update imports to use new component
2. Add deprecation notice to old component
3. Provide migration guide
4. Monitor for issues
5. Remove old component after grace period

## Accessibility Considerations

### ARIA Labels

```typescript
// Button examples
<button aria-label="Decrypt counter value" />
<button aria-label="Increment counter by one" />
<button aria-label="Decrement counter by one" />

// Status indicators
<div role="status" aria-live="polite" aria-label="FHEVM client status: ready" />

// Error messages
<div role="alert" aria-live="assertive" />
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order should follow visual hierarchy
- Focus indicators must be visible (2px yellow outline)
- Escape key should dismiss modals/errors

### Screen Reader Support

- Use semantic HTML elements
- Provide descriptive labels
- Announce state changes
- Include skip links for navigation

### Color Contrast

- Text on black background: #ffffff (21:1 ratio) ✓
- Yellow on black: #FED209 (16:1 ratio) ✓
- Gray text: #9ca3af (7:1 ratio) ✓
- Error red: #EF4444 (5.5:1 ratio) ✓

## Performance Optimization

### Code Splitting

```typescript
// Lazy load feature cards (below the fold)
const FeatureCards = lazy(() => import('./components/FeatureCards'));

// Lazy load contract info (less critical)
const ContractInfo = lazy(() => import('./components/ContractInfo'));
```

### Memoization

```typescript
// Memoize expensive computations
const formattedHandle = useMemo(() => {
  if (!encryptedHandle) return null;
  return `${encryptedHandle.slice(0, 10)}...${encryptedHandle.slice(-8)}`;
}, [encryptedHandle]);

// Memoize pure components
export const StatusCard = memo(StatusCardComponent);
export const FeatureCard = memo(FeatureCardComponent);
```

### Debouncing

```typescript
// Debounce rapid button clicks
const debouncedIncrement = useMemo(
  () => debounce(handleIncrement, 300),
  [handleIncrement]
);
```

## Migration Path

### Backward Compatibility

```typescript
// Old import (still works)
import { FHECounterDemo } from "~~/app/_components/FHECounterDemo";

// New import (recommended)
import { FHECounter } from "~~/app/_components/FHECounter";

// Both render the same component
```

### Deprecation Notice

```typescript
/**
 * @deprecated Use FHECounter from "~~/app/_components/FHECounter" instead
 * This export will be removed in v2.0.0
 */
export { FHECounter as FHECounterDemo } from "./FHECounter";
```

## Documentation Requirements

### Component Documentation

Each component should include:
- Purpose and usage
- Props interface with descriptions
- Code examples
- Accessibility notes
- Visual examples (Storybook optional)

### Developer Guide

- Architecture overview
- Component hierarchy
- State management patterns
- Styling conventions
- Testing guidelines

## Success Metrics

### Code Quality

- Component size: < 200 lines per file
- Test coverage: > 80%
- TypeScript strict mode: enabled
- Linting errors: 0
- Accessibility violations: 0

### Performance

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Component render time: < 16ms
- Bundle size increase: < 10%

### User Experience

- Animation smoothness: 60fps
- Button response time: < 100ms
- Error message clarity: User testing
- Mobile usability: Touch target size > 44px

## Conclusion

This modernization plan provides a comprehensive roadmap for transforming the FHECounter demo into a modular, maintainable, and visually polished showcase of the Universal FHEVM SDK. By following this design, we will create a component system that is easier to maintain, test, and extend while preserving all existing functionality and strengthening Zama's brand identity.
