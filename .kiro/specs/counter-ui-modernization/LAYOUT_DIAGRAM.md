# FHECounter UI Layout Diagram

## Desktop Layout (lg+)

```
┌─────────────────────────────────────────────────────────────────────┐
│                            HEADER                                    │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐│
│  │ 🟡 Logo + Title              │  │ Network Badge | Connect Btn  ││
│  └──────────────────────────────┘  └──────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         MAIN CONTENT                                 │
│                                                                      │
│  ┌────────────────────────────────────┐  ┌─────────────────────────┐│
│  │  LEFT COLUMN (7/12)                │  │ RIGHT COLUMN (5/12)     ││
│  │                                    │  │                         ││
│  │  ┌──────────────────────────────┐ │  │ ┌─────────────────────┐ ││
│  │  │   ENCRYPTED COUNTER          │ │  │ │  SYSTEM STATUS      │ ││
│  │  │                              │ │  │ │                     │ ││
│  │  │   Current Value              │ │  │ │  • FHEVM Client     │ ││
│  │  │                              │ │  │ │  • Encryption       │ ││
│  │  │        ???                   │ │  │ │  • Contract         │ ││
│  │  │     (or value)               │ │  │ │                     │ ││
│  │  │                              │ │  │ │  [Error messages]   │ ││
│  │  │   Handle: 0x1234...5678      │ │  │ └─────────────────────┘ ││
│  │  │                              │ │  │                         ││
│  │  │   ● Click Decrypt to reveal  │ │  │ ┌─────────────────────┐ ││
│  │  │                              │ │  │ │  CONTRACT INFO      │ ││
│  │  │  ┌────────┐ ┌────────────┐  │ │  │ │                     │ ││
│  │  │  │Decrypt │ │+ Increment │  │ │  │ │  Contract Address   │ ││
│  │  │  └────────┘ └────────────┘  │ │  │ │  Network            │ ││
│  │  │  ┌────────────┐              │ │  │ │  Your Address       │ ││
│  │  │  │- Decrement │              │ │  │ │                     │ ││
│  │  │  └────────────┘              │ │  │ └─────────────────────┘ ││
│  │  └──────────────────────────────┘ │  │                         ││
│  └────────────────────────────────────┘  └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        SDK FEATURES                                  │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │       🔧         │  │        ⚡        │  │       🛡️        │ │
│  │  Framework-      │  │   Wagmi-Like     │  │    Type-Safe     │ │
│  │   Agnostic       │  │      API         │  │                  │ │
│  │                  │  │                  │  │                  │ │
│  │  Works in any    │  │  Familiar        │  │  Full TypeScript │ │
│  │  JS environment  │  │  patterns        │  │  support         │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (<lg)

```
┌──────────────────────────────┐
│         HEADER               │
│                              │
│  🟡 Logo + Title             │
│                              │
│  Network Badge               │
│  Connect Button              │
└──────────────────────────────┘

┌──────────────────────────────┐
│    ENCRYPTED COUNTER         │
│                              │
│      Current Value           │
│                              │
│          ???                 │
│                              │
│  Handle: 0x1234...5678       │
│                              │
│  ● Click Decrypt to reveal   │
│                              │
│  ┌────────────────────────┐  │
│  │      Decrypt           │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │    + Increment         │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │    - Decrement         │  │
│  └────────────────────────┘  │
└──────────────────────────────┘

┌──────────────────────────────┐
│      SYSTEM STATUS           │
│                              │
│  • FHEVM Client              │
│  • Encryption                │
│  • Contract                  │
│                              │
│  [Error messages if any]     │
└──────────────────────────────┘

┌──────────────────────────────┐
│      CONTRACT INFO           │
│                              │
│  Contract Address            │
│  Network                     │
│  Your Address                │
└──────────────────────────────┘

┌──────────────────────────────┐
│         🔧                   │
│    Framework-Agnostic        │
│                              │
│  Works in any JS environment │
└──────────────────────────────┘

┌──────────────────────────────┐
│         ⚡                   │
│      Wagmi-Like API          │
│                              │
│    Familiar patterns         │
└──────────────────────────────┘

┌──────────────────────────────┐
│         🛡️                   │
│       Type-Safe              │
│                              │
│  Full TypeScript support     │
└──────────────────────────────┘
```

## Key Layout Features

### Grid System
- **Desktop**: 12-column grid
  - Left: 7 columns (58%)
  - Right: 5 columns (42%)
  - Gap: 32px (gap-8)

- **Mobile**: Single column
  - Full width stacking
  - Vertical spacing: 32px

### Spacing Scale
- Section margins: 48px (mb-12)
- Card padding: 32px (p-8) or 48px (p-12)
- Element gaps: 24px (gap-6) or 32px (gap-8)
- Small gaps: 16px (gap-4)

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px (lg)

### Visual Hierarchy
1. **Level 1**: Counter value (text-9xl, yellow, glowing)
2. **Level 2**: Section headings (text-xl, white, with bullets)
3. **Level 3**: Status labels (text-xs, gray, uppercase)
4. **Level 4**: Body text (text-sm, gray-400)

### Color Usage
- **Primary Action**: Yellow background (#FED209)
- **Secondary Action**: Yellow border with transparent bg
- **Status Ready**: Yellow dot
- **Status Loading**: Amber dot (pulsing)
- **Status Error**: Red dot
- **Status Idle**: Gray dot

### Animation Timing
- Header: 0.3s delay
- Counter: 0.4s delay
- Status: 0.4s delay + 0.1s
- Contract Info: 0.4s delay + 0.2s
- Features: 0.4s delay + 0.3s, 0.4s, 0.5s (staggered)
