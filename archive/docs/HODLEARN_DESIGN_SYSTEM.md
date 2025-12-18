# HODLearn Design System - Technical Style Guide

## Brand Identity

### **Logo & Typography**
- **Primary Logo**: "HL" monogram in orange square with "HODLearn" wordmark
- **Tagline**: "How-to-learn BTC" / "Understanding Bitcoin takes time. Building conviction takes community."
- **Brand Voice**: Professional, approachable, urgency-driven without being alarmist

## Typography System

### **Font Families**
- **Primary Font**: `'Poppins', sans-serif` (Google Fonts)
  - Used for: Headers, body text, UI elements
  - Weights: 300, 400, 500, 600, 700
  - Features: Clean, modern, highly readable
- **Secondary Font**: `'Fredoka', sans-serif` (Google Fonts)
  - Used for: Playful elements, special emphasis
  - Weights: 300, 400, 500, 600

### **Font Hierarchy**
- **H1-H6**: Poppins, font-weight: 500, line-height: 1.4
- **Body Text**: Poppins, font-weight: 400, line-height: 1.6
- **Buttons**: Poppins, font-weight: 500-600
- **Terminal/Code**: Poppins (maintaining consistency)

### **Typography Classes**
- `.terminal-text`: Poppins, 0.9em, font-weight: 400
- `.glow-text`: Primary color, font-weight: 600
- **Responsive Scaling**: text-xs (10px) to text-2xl based on context

## Color Palette

### **Primary Colors**
- **Bitcoin Orange**: `#f97316` (hsl(25, 95%, 53%))
  - Used for: Brand elements, CTAs, interactive states
  - CSS Variable: `--bitcoin`
- **Primary Green**: `hsl(142, 76%, 36%)`
  - Used for: Success states, positive metrics
  - CSS Variable: `--primary`

### **Dark Theme Foundation**
- **Background**: `hsl(240, 10%, 3.9%)` - Deep dark blue-gray
- **Card Background**: `hsl(240, 10%, 7%)` - Slightly lighter gray
- **Foreground**: `hsl(0, 0%, 98%)` - Near white text
- **Muted**: `hsl(240, 3.7%, 15.9%)` - Medium gray
- **Border**: `hsl(240, 3.7%, 15.9%)` - Subtle borders

### **Interactive States**
- **Warning**: `hsl(38, 92%, 50%)` - Amber/yellow
- **Destructive**: `hsl(0, 84%, 60%)` - Red for errors
- **Success**: `hsl(142, 76%, 36%)` - Green for confirmation

### **HODLearn Card Colors**
- **Default State**: 
  - Background: `bg-zinc-900/50`
  - Border: `border-zinc-700/50`
- **Interactive Hover**: 
  - Background: `bg-zinc-800/50`
  - Border: `border-orange-500/30`
  - Shadow: `shadow-orange-500/10`
- **Premium Variant**: 
  - Gradient: `from-zinc-900/80 to-zinc-800/60`
  - Enhanced shadow: `shadow-xl shadow-orange-500/20`

## Component Design System

### **Cards (Core Building Block)**
- **Base Card**: `rounded-lg border bg-card text-card-foreground shadow-sm`
- **Interactive Cards**: Hover effects with 1.02 scale and orange glow
- **Cyber Cards**: Material design shadows with subtle hover lift
- **Border Radius**: `var(--radius)` = 0.5rem (8px)

### **Buttons**
- **Primary**: Orange background (#f97316) with white text
- **Secondary**: Muted background with border
- **Ghost**: Transparent with hover states
- **Hover Effects**: `translateY(-1px)` with enhanced shadows

### **Navigation**
- **Bottom Navigation**: Dark background with orange active states
- **Tab Navigation**: Orange underline for active states
- **Header**: Sticky, backdrop blur, subtle border

### **Interactive Elements**
- **Hover Scale**: `scale-[1.02]` (subtle growth)
- **Transition Duration**: `300ms` (smooth but not slow)
- **Focus States**: 2px orange outline with 2px offset

## Animation System

### **Key Animations**
- **Fade In**: `translateY(10px)` to `translateY(0)` with opacity
- **Scale In**: `scale(0.8)` to `scale(1)` with bounce
- **Crisis Shake**: Horizontal shake for emphasis
- **Glow Breathe**: Subtle orange glow pulsing (8s duration)
- **Shimmer Border**: Orange light sweep effect

### **Animation Principles**
- **Duration**: Maximum 0.3s for interactions
- **Easing**: `ease-out` for most transitions
- **Subtlety**: Enhance without distracting
- **Performance**: Hardware-accelerated transforms

## Layout System

### **Spacing Scale**
- Based on Tailwind's rem scale (4px increments)
- **Container**: `max-w-6xl mx-auto` for main content
- **Mobile**: `px-4` horizontal padding
- **Desktop**: `px-6` or `px-8` for larger screens

### **Responsive Breakpoints**
- **Mobile First**: Design starts at 320px
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large**: 1280px and up

### **Safe Areas**
- **Mobile**: `safe-area-pb` class for bottom spacing
- **Header**: Sticky with backdrop blur
- **Bottom Nav**: Fixed with safe area insets

## Bitcoin-Specific Elements

### **Price Display**
- **Font**: Poppins, font-weight: 600
- **Color**: White primary, orange accents for changes
- **Format**: Comma-separated thousands, percentage changes
- **Real-time**: Green for positive, red for negative

### **Satoshi Displays**
- **Educational Focus**: Both sat and BTC denominations
- **Color**: Orange (#f97316) for earned satoshis
- **Animation**: Coin drop and float-up effects
- **Context**: Always show USD equivalent

### **Bitcoin Orange Usage**
- **Primary Brand Color**: #f97316
- **Interactive States**: 30% opacity borders, 10% shadow
- **Text Accents**: Full opacity for emphasis
- **Backgrounds**: Gradients with 80% opacity
- **Glow Effects**: 15-50% opacity for breathing animation

## Content Formatting

### **Educational Content**
- **Reading Level**: 8th grade (Flesch-Kincaid)
- **Paragraph Length**: 2-3 sentences maximum
- **Line Spacing**: 1.6 for body text, 1.4 for headers
- **Content Width**: Maximum 65 characters per line

### **Quiz Elements**
- **Question Cards**: Zinc background with orange accents
- **Answer Options**: Hover states with subtle highlighting
- **Correct Answers**: Green background with checkmark
- **Explanations**: Muted text with clear hierarchy

## Mobile Optimization

### **Touch Targets**
- **Minimum Size**: 44px x 44px (iOS guidelines)
- **Button Padding**: Generous vertical spacing
- **Navigation**: Bottom tabs for thumb accessibility
- **Cards**: Easy tap targets with clear feedback

### **Performance**
- **Image Optimization**: SVG for icons, WebP for photos
- **Animation**: Hardware acceleration with transform3d
- **Loading States**: Skeleton screens with matching colors
- **Caching**: Service worker for offline functionality

## Accessibility

### **Color Contrast**
- **Text**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: 3:1 minimum
- **Focus States**: Clear orange outline (2px)
- **Error States**: Color + text + icon indicators

### **Screen Readers**
- **Alt Text**: Descriptive for all images
- **ARIA Labels**: Comprehensive labeling
- **Focus Management**: Logical tab order
- **Semantic HTML**: Proper heading hierarchy

## Implementation Notes

### **CSS Variables**
All colors use CSS custom properties for easy theming:
```css
:root {
  --bitcoin: hsl(25, 95%, 53%);
  --background: hsl(240, 10%, 3.9%);
  --primary: hsl(142, 76%, 36%);
}
```

### **Tailwind Classes**
Common patterns:
- Interactive cards: `transition-all duration-300 hover:scale-[1.02]`
- Orange accents: `text-orange-400`, `border-orange-500/30`
- Dark backgrounds: `bg-zinc-900/50`, `bg-zinc-800/70`

### **Component Consistency**
- All interactive elements use HODLearn card format
- Orange glow indicates clickable/interactive
- Consistent spacing with Tailwind scale
- Mobile-first responsive design

This design system ensures visual consistency across all HODLearn touchpoints while maintaining the professional, approachable brand identity focused on making Bitcoin education accessible and engaging.