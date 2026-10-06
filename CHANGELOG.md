# Changelog — Aura LIFE OS

All notable changes to Aura LIFE OS will be documented in this file.

---

## [0.4.0] - Milestone 4 — Motion Engine, ADL & Foundation Refinement (Current)

### Added
- **Motion Engine Architecture**:
  - `src/animations/transitions.ts`: Token-driven spring (`snappy`, `gentle`, `bouncy`, `expressive`, `tight`) and tween transition presets.
  - `src/animations/variants.ts`: Complete motion variants for Fade, Slide, Scale, Modal, Drawer, Tooltip, Toast, Dropdown, and Skeletons.
  - `src/animations/gestures.ts`: Tactile button, card, row, and icon gesture motion props.
  - `src/animations/page.ts`: View and route transition variants with stagger container utilities.
  - `src/animations/layout.ts`: Accordion and resizable sidebar projection transitions.
  - `src/animations/reduced-motion.ts`: `prefers-reduced-motion` fallbacks converting spatial motion to pure opacity fades.
  - `src/animations/presets.ts`: Consolidated master motion preset library (`MOTION_PRESETS`).
- **Aura Design Language Documentation**:
  - `docs/Aura-Design-Language.md`: Complete standard specification covering design philosophy, visual hierarchy, spacing math, typography, color architecture, motion rules, component states, a11y, keyboard controls, and desktop OS behaviors.
- **Foundation Architecture Documentation**:
  - `ARCHITECTURE.md`: Technical stack, directory rules, layer diagram, state management patterns, theme/motion integration graphs.
  - `AURA_RULES.md`: Strict developer guidelines, anti-slop visual rules, performance constraints, and AI execution standards.
  - `ROADMAP.md`: Vision and upcoming milestones (Milestones 5–7).

### Refined
- Re-exported motion engine barrel exports in `src/animations/index.ts`.
- Verified 100% backward compatibility with all Milestone 1–3 stores and providers.

---

## [0.3.0] - Milestone 3 — Multi-Theme Core Engine

### Added
- **Theme Engine Architecture**:
  - `src/types/theme.ts`: Comprehensive type definitions for theme tokens, modes (`midnight`, `light`, `amoled`, `aurora`, `system`), and public theme API.
  - `src/config/themes.ts`: Configuration constants and system fallbacks.
  - `src/design-system/themes/`: Theme definitions for Midnight, Light, AMOLED, and Aurora.
  - `src/design-system/themes/index.ts`: High-performance CSS Custom Property injection engine (`applyThemeToCssVariables`).
  - `src/stores/theme-store.ts`: Zustand theme store with local storage persistence and OS preference auto-detection.
  - `src/providers/theme-provider.tsx`: React ThemeProvider component synchronizing store with CSS variables in real time.
  - `src/hooks/use-theme.ts`: Public hook exposing clean theme state and controls.

---

## [0.2.0] - Milestone 2 — State Management Infrastructure

### Added
- **State Stores**:
  - `useSidebarStore`: Sidebar collapsed/expanded state with local storage persistence.
  - `useNotificationStore`: Toast notification queue and management actions.
  - `useCommandPaletteStore`: Global command palette toggle and keyboard shortcut (`Cmd+K`).
- **Hooks**:
  - `useKeyboardShortcut`: Custom hook for registering global hotkeys.
  - `useMediaQuery`: Custom hook for responsive breakpoint listening.
  - `useReducedMotion`: Custom hook for OS reduced motion detection.

---

## [0.1.0] - Milestone 1 — Core Foundation & Project Scaffold

### Added
- Initial React 18, Vite, TypeScript, and Tailwind CSS configuration.
- Design tokens for colors, spacing, typography, and animation timings (`src/tokens/`).
- App configuration and metadata (`src/config/app.config.ts`, `metadata.json`).
- Root provider wrapper (`AuraProviders.tsx`).
- Diagnostic verification view in `App.tsx`.
