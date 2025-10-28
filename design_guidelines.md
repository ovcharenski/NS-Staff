# NS Team Portfolio - Design Guidelines

## Design Approach

**Reference-Based Creative Portfolio** - Drawing inspiration from modern creative agency sites (Awwwards winners, Dribbble portfolios) combined with Linear's refined minimalism and structured organization. The design emphasizes visual storytelling through photography while maintaining professional clarity for staff/project information.

**Core Philosophy**: Showcase creative work through bold imagery and unique interactions (polaroid fan), while keeping information architecture clean and scannable. Balance playful elements (photo spreads, hover effects) with professional content presentation.

---

## Typography System

**Primary Font**: Inter (via Google Fonts CDN) - Clean, modern, excellent at small sizes  
**Accent Font**: Space Grotesk (via Google Fonts CDN) - For headings and emphasis

**Hierarchy**:
- **Hero/Staff Names**: Space Grotesk, 48px (3rem), font-weight 700, tracking tight (-0.02em)
- **Section Headings**: Space Grotesk, 32px (2rem), font-weight 600
- **Card Titles**: Inter, 24px (1.5rem), font-weight 600
- **Body Large**: Inter, 18px (1.125rem), font-weight 400, line-height 1.6
- **Body**: Inter, 16px (1rem), font-weight 400, line-height 1.6
- **Metadata/Tags**: Inter, 14px (0.875rem), font-weight 500, tracking wide (0.02em), uppercase
- **Small Text/Nicknames**: Inter, 14px (0.875rem), font-weight 400, opacity 70%

---

## Layout System

**Spacing Scale**: Tailwind units of **2, 4, 6, 8, 12, 16, 20** for consistency
- Component internal padding: p-4 to p-6
- Section spacing: py-12 to py-20
- Card gaps: gap-6 to gap-8
- Margin separators: my-8 to my-16

**Grid System**:
- **Homepage sections**: max-w-7xl centered container
- **Staff grids**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6
- **Project grids**: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 with gap-4
- **Staff detail page**: Two-column layout on desktop (40% photos / 60% content), stack on mobile

---

## Component Library

### Navigation Header
- Fixed top bar, backdrop-blur with subtle dark transparency
- Left: NS Staff logo (small icon + wordmark), hover reveals company founding dates in tooltip
- Right: Language switcher (clean toggle: EN/RU with smooth transition)
- Height: 64px (h-16), horizontal padding: px-6

### Staff Member Cards (Small)
- Card dimensions: aspect-ratio 3:4, rounded-2xl
- Background: dark gradient with staff accent color subtle overlay (10% opacity)
- Content: Staff photo (top 60%), name with country flag emoji, main nickname, position
- Hover: Lift effect (translate-y-1), accent color glow, scale-105 transition
- Border: 1px solid with staff accent color at 20% opacity

### Project Cards (Small)
- Card dimensions: aspect-ratio 16:10, rounded-xl
- Background: Dark with project preview image as subtle backdrop (20% opacity)
- Content: Project name (bold), tags as small pills with project accent colors
- Hover: Image brightens to 40% opacity, card border glows with accent color

### Polaroid Photo Fan (Staff Detail)
- Three polaroid frames: white border (16px), subtle shadow, rotations: -8deg, 0deg, +8deg
- Default state: Overlapping cascade with z-index layering
- Hover state: Fan spreads to -15deg, 0deg, +15deg with translateX separation
- Mobile: Show only first photo, full width, no rotation
- Smooth spring animation (duration-500 ease-out)

### Project Card (Extended)
- Full-width or large card with preview image (aspect-ratio 16:9)
- Content section: Project name, tags row, rich description, developer mini-cards row
- Developer mini-cards: 48px circular avatars with names on hover
- Background: Gradient from dark to project accent color (subtle, 5% at bottom)

### Search Fields
- Clean input with icon prefix, rounded-full, dark background with lighter border
- Focus state: Accent color glow, border brightens
- Placeholder: Translucent text at 50% opacity
- Icon: Heroicons search icon, 20px

### QR Business Card (Generated Image)
- Dimensions: 1080x1920px (mobile-optimized portrait)
- Layout: Staff name + flag top, main nickname + position, first photo center, QR code bottom
- Background: Gradient using staff's color1 and color2
- Modern, minimalist design with ample whitespace

---

## Visual Design & Effects

**Dark Theme Palette**:
- Background primary: #0a0a0a (near black)
- Background secondary: #1a1a1a
- Surface: #242424
- Text primary: #ffffff
- Text secondary: #a0a0a0
- Borders: #333333

**Accent Color System**:
- Each staff/project has 3 colors: color1 (primary), color2 (secondary), color_main (brand)
- Use as: borders (20% opacity), glows on hover, tag backgrounds (15% opacity), gradient overlays
- Global brand color (NS Team): #28735d - use for logo, main CTAs

**Interactive States**:
- **Hover**: Scale-105, opacity transitions, accent color glows
- **Active/Focus**: Accent color borders brighten to 60% opacity
- **Disabled**: Opacity 40%, no interactions

**Animations**: Minimal and purposeful
- Page transitions: Fade in content with slight translateY (-8px to 0)
- Polaroid fan: Smooth rotation and translation on hover (duration-500)
- Card hovers: Scale and glow (duration-300)
- No scroll-triggered animations, no auto-playing carousels

---

## Page-Specific Layouts

### Homepage
- Header (fixed top)
- Hero section: Large NS Staff wordmark, tagline, visual accent (abstract shape with brand colors)
- Two main sections with clear dividers:
  1. **Staff Section**: Search bar, grid of small staff cards
  2. **Projects Section**: Search bar, grid of small project cards
- Footer: Minimal, company info, social links if available

### Staff Detail Page
- Header with NS Staff logo (click returns home), language switcher
- Staff endpoint badge (hover shows contact tooltip with email, Telegram, GitHub icons)
- Two-column layout (desktop):
  - **Left 40%**: Polaroid photo fan (three images)
  - **Right 60%**: Name with country flag, nicknames, position/age/language flags with tooltips, description
- **Projects section**: Heading "Projects", grid of small project cards
- Mobile: Stack vertically, single photo shown

### Project Detail Page (if implemented)
- Hero with large project image
- Content: Name, tags, full description
- Team section: Grid of small developer cards
- Related projects if applicable

---

## Icons & Assets

**Icon Library**: Heroicons (outline variant) via CDN - consistent 24px size
- Navigation: home, globe (language), search, user, folder
- Contact tooltips: envelope, chat, code (GitHub)
- Use sparingly, only where they enhance comprehension

**Images**:
- Staff photos: Provided PNGs from data/staff/<endpoint>/ folder
- Project previews: Provided images from data/projects/pictures/
- All images: Lazy-loaded, optimized WebP with PNG fallback
- Polaroid frames: CSS border styling (no generated SVG frames)

---

## Accessibility

- WCAG AA contrast ratios on dark backgrounds (text vs background: 4.5:1 minimum)
- Focus indicators: 2px accent color outline with 2px offset
- Language flags: Include aria-label with language name
- Tooltips: Keyboard accessible, aria-describedby
- Search inputs: Proper labels and placeholders
- All interactive elements: Min 44x44px touch targets on mobile

---

## Responsive Breakpoints

- **Mobile**: < 768px - Single column, stacked layouts, simplified interactions
- **Tablet**: 768px - 1024px - Two-column grids, begin showing hover states
- **Desktop**: > 1024px - Full multi-column grids, all interactions enabled

**Mobile Considerations**:
- Polaroid fan: Show only first photo, no hover effect
- Navigation: Compact header, hamburger if needed
- Cards: Full-width with reduced padding
- Search: Full-width inputs