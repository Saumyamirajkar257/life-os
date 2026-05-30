# Life OS — Specification Document

## 1. Concept & Vision

**Life OS** is a premium personal operating system for life management — blending the elegance of macOS interactions, Notion's organizational clarity, a finance dashboard's utility, and Swiss brutalist typography. The experience feels like a luxury desktop environment where every pixel serves a purpose. Typography is the primary visual language; whitespace is the primary design element.

> *"A luxury operating system for life — built on the web"*

---

## 2. Design Language

### Aesthetic Direction
Swiss-style brutalist minimalism with editorial typography. Think: Bloomberg Businessweek meets macOS Big Sur. No gradients, no neon, no visual noise. Only structure, type, and breath.

### Color Palette
| Role | Hex | Usage |
|---|---|---|
| Background | `#f2f2f2` | Page backgrounds |
| Primary text | `#111111` | Headlines, primary content |
| Secondary text | `#838282` | Descriptions, metadata |
| Light gray (layer 1) | `#d9d9d9` | Echo typography layer 1 |
| Light gray (layer 2) | `#d0d0d0` | Echo typography layer 2 |
| Light gray (layer 3) | `#c7c7c7` | Echo typography layer 3 |
| Light gray (layer 4) | `#bebebe` | Echo typography layer 4 |
| Borders | `rgba(30,30,30,0.1)` | Dividers, card borders |
| Dark surface | `#1e1e1e` | Footer, dark sections |
| Dark text | `#f6f6f6` | Text on dark surfaces |

### Typography
- **Headings**: Clash Display (Google Fonts fallback: DM Serif Display for italic contrast)
  - Weight: 700
  - Letter-spacing: -0.05em
  - Line-height: 0.9
- **Body**: Satoshi (Google Fonts fallback: Inter)
  - Weight: 500
  - Letter-spacing: 0
  - Line-height: 1.5

### Spatial System
- Base unit: 8px
- Section padding: 120px vertical, 80px horizontal
- Card padding: 32px
- Grid gap: 24px
- Border radius: 16px (cards), 999px (pills)

### Motion Philosophy
- **Duration**: 700ms base
- **Easing**: `cubic-bezier(0.77, 0, 0.175, 1)` (premium, controlled)
- **Hover scale**: 1.05
- **3D tilt**: max 8 degrees
- **Principle**: Calm, controlled, never flashy. Every animation communicates intentionality.

### Visual Assets
- Icon style: Minimal line icons (custom SVG)
- No stock photos; use geometric shapes and typography as decoration
- Echo Typography: 4-layer stacked text with offset layers

---

## 3. Layout & Structure

### Page Architecture

```
/ (index.html)         — Landing page: Hero + Philosophy + Showcase + Footer
/login                — Split-screen authentication page
/app                  — Dashboard: Sidebar + Dock + Module Grid
```

### Landing Page Flow
1. **Sticky Navigation** (80px, blur backdrop)
2. **Hero** (100vh, centered echo typography, 3D tube background)
3. **Philosophy** (Large quote, 3-column grid)
4. **Showcase** (Interactive 3D tilt cards: Finance, Tasks, Analytics, AI)
5. **Footer** (Dark theme, 4 columns)

### Dashboard Layout
- **Top Bar**: Minimal, 60px, contains sidebar toggle + user avatar
- **Sidebar**: 72px collapsed, 280px expanded, left side
- **Main Content**: 12-column grid, fills remaining space
- **Bottom Dock**: macOS-style, centered, 72px height, glassmorphism

### Responsive Strategy
- Desktop-first (1440px design width)
- Tablet: Stack columns, reduce dock icons
- Mobile: Full-width cards, minimal dock

---

## 4. Features & Interactions

### Landing Page

#### Sticky Navigation
- **Default**: Blur backdrop, transparent background
- **Scroll**: Adds subtle shadow
- **Hover (links)**: Underline slides in from left
- **Login button**: Pill shape, fills on hover

#### Hero Section
- Echo Typography "LIFE OS" at ~20vw font size
- Subtle parallax on scroll
- CTA button fades in after 1s delay
- 3D tube background: cursor-following bezier curves, monochrome, soft opacity

#### 3D Tube Background (Three.js)
- Monochrome tubes following cursor
- No random colors
- Overlay: `rgba(242,242,242,0.85)` with blur
- Max ~8 visible tubes
- Very subtle, atmospheric

#### Philosophy Section
- Large pull quote (Clash Display, 4-5vw)
- One word in italic serif for contrast
- Horizontal divider line
- 3-column grid explaining the system

#### Showcase Cards
- 3D tilt on mouse move (max 8°)
- Grayscale filter → full color on hover
- Scale 1.05 on hover
- Overlay text reveals on hover
- Categories: Finance, Tasks, Analytics, AI Assistant

### Login Page

#### Split Layout
- Left 50%: Echo typography + tagline
- Right 50%: Form with glass card

#### Form Interactions
- Underline-style inputs (no full borders)
- Focus: Line thickens, subtle glow
- Google button: Outlined pill
- Apple button: Outlined pill (UI ready, non-functional)
- Login button: Solid black, fills on hover
- Error states: Red underline + shake animation
- Success: Redirect to /app with fade transition

#### Animations
- Page load: Left slides in from left, right from right
- Form fields stagger in (100ms delay each)

### Dashboard

#### Bottom Dock (Primary Navigation)
- macOS magnification effect on hover
- Spring animation for scaling
- Glassmorphism background (blur + transparency)
- Icons: Home, Finance, Tasks, Analytics, Profile, Settings
- Active indicator: Dot below icon

#### Sidebar
- Minimized by default (72px)
- Expands on hover/click (280px)
- Sections: Navigation, Quick Stats, Recent

#### Finance Module
- Balance card with large number
- Spending breakdown (minimal bar chart)
- Recent transactions list

#### Tasks Module
- Clean checklist
- Add task input
- Complete animation (strikethrough + fade)

#### Analytics Module
- Big metric cards
- Subtle count-up animation on load
- Sparkline graphs

#### Profile/Settings
- Avatar with edit overlay
- Clean form inputs
- Toggle switches for preferences

---

## 5. Component Inventory

### Echo Typography
- **States**: Default (4 layers visible)
- **Animation**: Layers shift opacity on hover

### Navigation Pill
- **Default**: Transparent, text visible
- **Hover**: Background fills, text inverts
- **Active**: Solid fill

### Showcase Card
- **Default**: Grayscale, flat
- **Hover**: Color, tilt 3D, scale 1.05
- **Transition**: 700ms ease

### Dock Item
- **Default**: 48px icon
- **Hover**: Scale 1.4 + label tooltip
- **Active**: Dot indicator

### Form Input
- **Default**: Bottom border only
- **Focus**: Border thickens
- **Error**: Red border + message
- **Disabled**: Reduced opacity

### Button
- **Primary**: Solid black fill, white text
- **Secondary**: Outlined, black border
- **Hover**: Invert colors
- **Loading**: Spinner replaces text

### Dashboard Card
- **Default**: White background, subtle border
- **Hover**: Shadow deepens
- **Interactive**: 3D tilt effect

### Toggle Switch
- **Off**: Gray track, white knob
- **On**: Black track, white knob

---

## 6. Technical Approach

### Architecture
- **No frameworks** — Pure HTML, CSS, JavaScript
- **Three.js** (CDN) — Only for 3D tube background
- **Google Fonts** — Clash Display, Satoshi (via CDN)
- **File structure**:
  ```
  /
  ├── index.html
  ├── login.html
  ├── app.html
  ├── style.css
  └── script.js
  ```

### State Management
- Simple `localStorage` for auth state
- DOM-based state updates (no store)
- Session persistence via localStorage

### JavaScript Organization
```javascript
// Section 1: Utility functions (debounce, lerp, etc.)
// Section 2: Three.js Tube Background
// Section 3: 3D Tilt Effect
// Section 4: Dock Animation
// Section 5: Sidebar
// Section 6: Navigation
// Section 7: Login/Auth
// Section 8: Dashboard modules
```

### Performance Considerations
- RequestAnimationFrame for all animations
- Debounced scroll/resize handlers
- CSS transforms only (no layout thrashing)
- Lazy initialization for off-screen content

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid with fallbacks
- Intersection Observer for lazy effects