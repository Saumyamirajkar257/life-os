# Aura Design Language (ADL)
*Version 1.0.0 — Official Design System Standard for Aura LIFE OS*

---

## 1. Design Philosophy

Aura LIFE OS is designed around four foundational principles:

1. **Organic Precision**: Human-centered aesthetics paired with mathematical spatial grids (8pt base / 4pt micro grid). Every visual element exists with deliberate intent, avoiding gratuitous decoration or unrequested layout noise.
2. **Invisible Architecture**: Interfaces prioritize focus. Chrome and controls step back when inactive and respond dynamically upon interaction. Content is king.
3. **Deliberate Rhythm**: Typographic hierarchies, elevation levels, and spring physics work in unison to establish clear visual scanning patterns and predictable motion response.
4. **Desktop-First Mastery**: Built for high-density, multi-window productivity on desktop operating systems (macOS and Windows), while remaining fluidly adaptable down to mobile viewports.

---

## 2. Visual Hierarchy & Spatial Mathematics

Visual weight is established through tokenized elevation, typography contrast, and container nesting rules:

- **Surface Contrast**: Surfacing changes signal elevation. A container sitting on a background must never exceed 12% brightness difference in dark mode or 7% in light mode.
- **Corner Nesting Rule**: Nested rounded containers mathematically calculate inner radius:
  $$\text{Inner Radius} = \text{Outer Radius} - \text{Padding}$$
  *Example*: A card with `rounded-2xl` (16px) and `p-3` (12px) contains an inner badge with `rounded-xs` (4px).
- **Z-Index System**:
  - `Base Canvas`: Z-0
  - `Sticky Navigation / Header`: Z-10
  - `Dropdown / Popover / Tooltip`: Z-20
  - `Drawer / Sidebar Overlay`: Z-30
  - `Modal Backdrop & Window`: Z-40
  - `Global Command Palette (Cmd+K)`: Z-50
  - `Toast Notifications`: Z-60

---

## 3. Spacing Rules

Aura strictly enforces an 8pt primary spatial grid and 4pt micro-adjustment grid:

- **Token Scale**:
  - `micro`: 4px (`gap-1`, `p-1`)
  - `compact`: 8px (`gap-2`, `p-2`)
  - `comfortable`: 12px (`gap-3`, `p-3`)
  - `base`: 16px (`gap-4`, `p-4`)
  - `spacious`: 24px (`gap-6`, `p-6`)
  - `section`: 32px (`gap-8`, `p-8`)
  - `hero`: 48px (`gap-12`, `p-12`)
- **Container Padding Mathematics**:
  - Outer container padding MUST always equal or exceed the inner padding between its child elements.
  - Minimum container padding for interactive cards is 16px.
  - Button horizontal padding is exactly $2\times$ vertical padding (e.g., `px-4 py-2`).

---

## 4. Typography Rules

- **Font Pairing**: Plus Jakarta Sans for UI body and display, paired with JetBrains Mono for code, shortcuts, and numeric metadata.
- **Modular Scale (1.25 Major Third)**:
  - `xs`: 12px / 16px line-height (Labels, captions)
  - `sm`: 14px / 20px line-height (Secondary UI)
  - `base`: 16px / 24px line-height (Default body)
  - `lg`: 20px / 28px line-height (Section headers)
  - `xl`: 24px / 32px line-height (Card titles)
  - `2xl`: 30px / 38px line-height (View titles)
  - `3xl`: 38px / 46px line-height (Display metrics)
- **Line Width Constraints**: Body paragraphs are constrained to 65–75 characters (`max-w-prose`) to maximize reading speed and minimize cognitive fatigue.
- **Single-Line Button Labels**: Text inside buttons, tabs, pills, and badges must sit on ONE line (`white-space: nowrap`) — line wrapping inside controls is prohibited.

---

## 5. Color Philosophy

Aura uses a 3-Layer Token Engine:
1. **Primitive Tokens**: Immutable hex values (`slate-900`, `blue-500`, `violet-600`).
2. **Semantic Tokens**: Contextual roles (`--color-bg`, `--color-surface`, `--color-border-subtle`, `--color-accent`).
3. **Component Tokens**: Isolated component styling mapped directly to CSS custom properties.

**Theme Profiles**:
- **Midnight (Default Dark)**: Deep navy canvas (`#0b1120`), dark slate surface, royal blue accents.
- **Light (Warm Minimal)**: Crisp warm canvas (`#fdfdfd`), soft borders, dark slate contrast accents.
- **AMOLED (Pure Black)**: `#000000` canvas engineered for zero OLED power consumption with electric cyan/blue accents.
- **Aurora (Cosmic Dark)**: Deep cosmic violet (`#0d0b18`) canvas with glowing teal/purple accents.

**Contrast Requirements**:
- All primary text achieves minimum WCAG AA contrast ratio of 4.5:1 against its background.
- Interactive focus rings use `--color-focus-ring` with 2px offset.

---

## 6. Motion Philosophy

- **Physics-First**: Spring dynamics (`stiffness`, `damping`, `mass`) replace arbitrary linear easing curves.
- **GPU Acceleration**: Motion is restricted strictly to `transform` (translate, scale) and `opacity`. Width, height, margin, and layout-shifting properties are never animated during active transitions.
- **Zero Layout Shift**: Dynamic components (drawers, modals, popovers) use absolute projection or fixed overlays to avoid disturbing sibling DOM geometry.
- **Reduced Motion**: Respects `prefers-reduced-motion` media queries by collapsing spatial translations into instant 0.1s opacity fades via `getReducedMotionVariant()`.

---

## 7. Component Behaviour & Interaction States

Every interactive element implements seven explicit interaction states:
1. **Default**: Rest state with tokenized border and surface fill.
2. **Hover**: Slight lift (`y: -1px` or `y: -2px`), scale shift (`1.02`), and subtle surface highlight.
3. **Press / Tap**: Micro contraction (`scale: 0.97`) providing immediate tactile feedback.
4. **Focus**: Visible 2px outline using `--color-focus-ring` with `outline-offset-2`.
5. **Disabled**: Reduced opacity (`opacity-50`), `cursor-not-allowed`, and suppressed gesture listeners.
6. **Loading**: Suppressed text with inline spinner or skeleton pulse overlay.
7. **Error / Invalid**: Border color shifts to `--color-error` with micro slide-shake effect.

---

## 8. Loading States

- **Skeleton Waves**: Match exact component dimensions with `--color-surface-muted` pulse variants (`skeletonPulseVariants`).
- **Shimmer Overlays**: Used for multi-card grid initial loads.
- **Inline Spinners**: Rendered inside action buttons when performing async operations.
- **Optimistic Updates**: Immediate UI state mutation paired with background synchronization and rollbacks on failure.

---

## 9. Error States

- **Inline Input Errors**: Displayed directly beneath the affected input with `--color-error` typography and `alert` role.
- **Toast Notifications**: Non-blocking slide-in alerts from the bottom/top corners with auto-dismiss and manual action buttons.
- **Error Boundary Cards**: Isolated component fallback cards with retry actions, preventing whole-app crashes.

---

## 10. Empty States

Empty states follow a strict 3-part layout structure:
1. **Graphic / Icon Container**: Soft `--color-accent-muted` badge containing an illustrative vector icon.
2. **Informative Copy**: Clear headline stating what is empty, followed by a single sentence explaining how to populate it.
3. **Primary Call-to-Action**: Single primary button triggering creation or search filter reset.

---

## 11. Hover & Focus Behaviour

- **Hover Isolation**: Hover effects respond only to fine pointer inputs (`@media (hover: hover)`).
- **Focus Ring Standard**: Focus is triggered via keyboard navigation (`:focus-visible`). Focus rings utilize `ring-2 ring-[var(--color-focus-ring)] ring-offset-2 ring-offset-[var(--color-bg)]`.

---

## 12. Keyboard Interactions

Aura LIFE OS is fully executable without a pointing device:

- `Cmd+K` / `Ctrl+K`: Toggle Global Command Palette.
- `Cmd+\` / `Ctrl+\`: Toggle Navigation Sidebar.
- `Escape`: Dismiss active modal, drawer, command palette, or dropdown.
- `Tab` / `Shift+Tab`: Predictable sequential DOM focus traversal.
- `Arrow Keys`: Roving focus inside menus, tabs, and list grids.

---

## 13. Accessibility Standards (a11y)

- Complies with **WCAG 2.1 AA** guidelines.
- Semantic HTML tags (`<nav>`, `<main>`, `<header>`, `<aside>`, `<article>`) used across all layouts.
- Dynamic controls include `aria-expanded`, `aria-controls`, `aria-selected`, `aria-label`, and `role`.
- Full contrast verification across all theme variations.

---

## 14. Desktop-First Principles

Aura LIFE OS treats the browser window as a full desktop workspace:

- **Fluid Grid Density**: Multi-pane resizable layouts that scale smoothly up to 4K displays (`max-w-7xl` or full-bleed window options).
- **Splitter Views**: Drag-resizable sidebar and detail panes with active collision management.
- **Multi-Window Support**: Windowing primitives ready for floating modal frames and desktop docks.

---

## 15. Windows Behaviour

- **Titlebar Integration**: Clean window controls (minimize, maximize, close) with Windows 11 Fluent snapping support.
- **Keyboard Shortcuts**: Mapped to standard `Control` + key combinations.
- **Scrollbar Styling**: Discrete, custom overlay scrollbars (`var(--color-scrollbar-thumb)`) matching Fluent design parameters.

---

## 16. macOS Behaviour

- **Traffic Light Controls**: Top-left window controls matching native macOS window metrics.
- **Vibrancy & Glassmorphic Backdrop**: Frosted glass effects utilizing `backdrop-filter: blur(12px)` and `--color-glass-bg`.
- **Keyboard Shortcuts**: Mapped natively to `Command` ($\⌘$) key combinations.
