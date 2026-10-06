# Aura Life OS — System Architecture
*Document Version: 1.0.0 — Aura Core Milestone 4 Foundation*

---

## 1. System Overview

Aura LIFE OS is a high-performance, desktop-class web operating system environment built on React 18, Vite, TypeScript, Tailwind CSS, Zustand, and Motion (Framer Motion). The application operates on a 3-layer modular architecture designed for maximum performance, type safety, zero layout shifts, and full theme flexibility.

---

## 2. Architectural Layer Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 5. Application Suites                       │
│    (Tasks, Habits, Finance, Notes, Calendar, AI Engine)     │
├─────────────────────────────────────────────────────────────┤
│                 4. Window & Dock Engine                     │
│    (Floating Windows, Resizable Panes, Workspace Docks)     │
├─────────────────────────────────────────────────────────────┤
│                 3. Primitive UI Components                   │
│      (Buttons, Inputs, Cards, Modals, Drawers, Toasts)      │
├─────────────────────────────────────────────────────────────┤
│                 2. Aura Core Infrastructure                 │
│  (Theme Engine, Motion Engine, State Stores, Design Tokens) │
├─────────────────────────────────────────────────────────────┤
│                 1. Framework & Runtime Base                 │
│      (React 18, Vite, TypeScript, Tailwind CSS, Motion)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Responsibilities & Rules

| Folder Path | Purpose & Responsibility | Import Rules & Constraints |
| :--- | :--- | :--- |
| `src/tokens/` | Immutable design tokens (colors, spacing, typography, animations, elevation). | No internal imports. Pure JavaScript/TypeScript objects. |
| `src/types/` | Global TypeScript types, interfaces, and enums. | May import from other types. No component or store logic. |
| `src/config/` | Application configuration, constants, theme maps. | Imports tokens and types only. |
| `src/design-system/` | Theme definitions (Midnight, Light, AMOLED, Aurora) and CSS Custom Property engine. | Imports tokens and types. |
| `src/stores/` | State management modules using Zustand + Persist (Theme, Sidebar, Notification, CommandPalette). | May import types, config, and tokens. |
| `src/animations/` | Motion Engine (variants, transitions, gestures, page, layout, reduced-motion). | Imports tokens and Motion runtime. |
| `src/providers/` | Application React context providers (ThemeProvider, AuraProviders). | Wraps root layout. Syncs stores with document DOM. |
| `src/hooks/` | Decoupled custom React hooks (`useTheme`, `useMediaQuery`, `useKeyboardShortcut`). | Consumes stores, animations, and types. |
| `src/lib/` | Utility functions (`cn`, formatting, storage helpers). | Pure utility helper routines. |
| `docs/` | System design standards and guidelines (`Aura-Design-Language.md`). | Documentation only. |

---

## 4. Module Architecture & Dependency Graph

```
                   ┌─────────────────┐
                   │  src/tokens/    │
                   └────────┬────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ src/design-    │ │ src/animations/│ │  src/stores/   │
│ system/        │ │                │ │                │
└────────┬───────┘ └────────┬───────┘ └────────┬───────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │   src/hooks/    │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ src/providers/  │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │   src/App.tsx   │
                   └─────────────────┘
```

---

## 5. State Management Conventions

- **Store Library**: Zustand with `persist` middleware (`createJSONStorage(() => localStorage)`).
- **Isolation**: Each domain (Theme, Sidebar, Notifications, Command Palette) maintains its own dedicated, lightweight store file.
- **Selector Access**: Components consume store state using specific selectors or dedicated custom hooks (`useTheme()`) to avoid unnecessary parent-child re-renders.

---

## 6. Theme Engine Integration

- The Theme Engine uses a **3-Layer Token System**:
  1. JavaScript token primitives (`/src/tokens/colors.ts`).
  2. Theme Definitions (`/src/design-system/themes/`).
  3. Dynamic CSS Custom Properties injected into `document.documentElement` (`data-theme="midnight"`).
- Swapping themes updates CSS variables instantly without requiring React component re-renders.

---

## 7. Motion Engine Integration

- Driven by `motion/react` (Framer Motion).
- All animations use GPU-accelerated properties (`transform: translate/scale` and `opacity`).
- Reduced motion support is built directly into the motion engine (`reduced-motion.ts`).
