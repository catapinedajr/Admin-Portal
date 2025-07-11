# HODLearn Card Format - Design System

## Overview
The "HODLearn Card Format" is our standardized interactive card design system, inspired by the streak achievement card's engaging hover states and visual feedback patterns.

## Core Design Principles

### 1. **Dark/Inactive Default State**
- Background: `bg-zinc-900/50` (dark, subtle)
- Border: `border-zinc-700/50` (muted gray)
- Text: Readable but not attention-grabbing
- Visual hierarchy: Content is visible but not demanding

### 2. **Orange Glow Engagement State**
- Border: `hover:border-orange-500/30` (orange accent on hover)
- Shadow: `hover:shadow-orange-500/10` (subtle orange glow)
- Background: `hover:bg-zinc-800/50` (slightly lighter)
- Scale: `hover:scale-[1.02]` (subtle growth for tactile feedback)

### 3. **Transition Animation**
- Duration: `transition-all duration-300` (smooth, not jarring)
- Easing: Browser default (ease-in-out feel)
- Transforms: Scale and color changes unified

## Component Variants

### Default Variant
```tsx
// Subtle hover effects, no strong interaction cues
<HODLearnCard variant="default">
  <YourContent />
</HODLearnCard>
```

### Interactive Variant  
```tsx
// Orange glow, scale effect, clear interaction feedback
<HODLearnCard variant="interactive" onClick={handleClick}>
  <YourContent />
</HODLearnCard>
```

### Premium Variant
```tsx
// Enhanced effects with gradients and ring glow
<HODLearnCard variant="premium" onClick={handleClick}>
  <YourContent />
</HODLearnCard>
```

## Usage Examples

### Learning Progress Cards
```tsx
<HODLearnInteractiveCard onClick={() => navigate('/learn')}>
  <div className="flex items-center gap-3">
    <BookIcon className="w-6 h-6 text-orange-400" />
    <div>
      <h3 className="font-medium text-white">Today's Lesson</h3>
      <p className="text-sm text-gray-400">Day 14 Progress Assessment</p>
    </div>
  </div>
</HODLearnInteractiveCard>
```

### Feature Cards
```tsx
<HODLearnCard variant="interactive" onClick={() => navigate('/simulators')}>
  <div className="space-y-2">
    <h3 className="font-semibold text-white">Bitcoin Simulators</h3>
    <p className="text-sm text-gray-400">Practice with fake money</p>
  </div>
</HODLearnCard>
```

### Premium Feature Cards
```tsx
<HODLearnPremiumCard onClick={() => navigate('/premium')}>
  <div className="flex items-center gap-3">
    <Crown className="w-6 h-6 text-yellow-400" />
    <div>
      <h3 className="font-medium text-white">Advanced Strategies</h3>
      <p className="text-sm text-gray-400">Unlock premium content</p>
    </div>
  </div>
</HODLearnPremiumCard>
```

## Design Tokens

### Colors
- **Default Background**: `zinc-900/50` → `zinc-800/70`
- **Interactive Background**: `zinc-900/50` → `zinc-800/50`  
- **Premium Background**: `gradient-to-br from-zinc-900/80 to-zinc-800/60`
- **Border Default**: `zinc-700/50` → `zinc-600/50`
- **Border Interactive**: `zinc-700/50` → `orange-500/30`
- **Shadow Interactive**: `shadow-lg shadow-orange-500/10`
- **Shadow Premium**: `shadow-xl shadow-orange-500/20`

### Transforms
- **Scale Interactive**: `hover:scale-[1.02]`
- **Scale Premium**: `hover:scale-[1.03]`
- **Ring Premium**: `hover:ring-1 hover:ring-orange-500/30`

### Spacing
- **Card Padding**: `p-4 md:p-5` (responsive)
- **Content Gap**: Use `gap-3` for icon/text combinations
- **Chevron Margin**: `ml-3` when used

## Implementation Notes

1. **Accessibility**: All interactive cards include proper focus states and keyboard navigation
2. **Performance**: Transitions use transform and opacity for smooth 60fps animations  
3. **Consistency**: All cards use the same timing function and duration
4. **Flexibility**: Content area is completely flexible while maintaining consistent shell behavior

## System Benefits

1. **Visual Cohesion**: All interactive elements follow same engagement pattern
2. **User Recognition**: Users learn to expect orange glow = interactive
3. **Reduced Decision Fatigue**: Designers don't need to recreate hover states
4. **Maintenance**: Central component means updates propagate everywhere
5. **Development Speed**: Drop-in component for any card-based UI element

## Migration Path

Existing cards can be gradually migrated to use HODLearnCard components while maintaining exact visual appearance, then enhanced with standardized interactions over time.