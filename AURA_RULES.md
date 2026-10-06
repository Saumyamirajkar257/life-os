# Aura LIFE OS — Engineering Standards & Development Rules
*Document Version: 1.0.0 — Mandatory Rules for Human and AI Developers*

---

## 1. Absolute Directives

1. **Strict User Intent & Scope Discipline**: Build exactly what is requested. Never add unsolicited features, tabs, or secondary architectures unless explicitly requested.
2. **Zero Hardcoded Values**:
   - **Colors**: NEVER hardcode hex, rgb, or tailwind arbitrary color strings in component code. Always use CSS variables (`var(--color-bg)`, `var(--color-accent)`) or theme tokens.
   - **Spacing**: ALWAYS use the 8pt/4pt token spatial scale (`gap-2`, `p-4`, `space-y-3`).
   - **Animations**: ALWAYS use Motion Engine presets (`MOTION_PRESETS`, `springTransitions`). Never write inline spring objects or un-tokenized transitions.
3. **No Breaking Changes**: Maintain strict backward compatibility for existing exports and public store interfaces.
4. **Full Type Safety**: Strict TypeScript mode (`"noImplicitAny": true`, `"strict": true`). No `any` types unless interfacing with un-typed third-party JS.

---

## 2. Coding & Styling Conventions

- **Tailwind Utility Classes**: All component styling must use Tailwind utility classes in combination with standard CSS Custom Properties defined by the active theme.
- **Single CSS File Constraint**: Global styles reside exclusively in `/src/index.css`. Creating additional `.css` or `.module.css` files is forbidden.
- **Component Separation**: Keep file sizes modular. Extract types into `/src/types/`, helper logic into `/src/lib/`, and state into `/src/stores/`.
- **Lucide Icons**: All UI icons MUST be imported exclusively from `lucide-react`. Custom inline SVG icons are strictly forbidden.

---

## 3. Anti-Slop Visual Standards

- **No Gratuitous AI Gradients**: Avoid bright cyan-on-dark, neon purple-to-blue gradients, or arbitrary glowing drop shadows.
- **No Unnecessary Cards inside Cards**: Maintain flat, elegant spatial hierarchy using subtle borders (`border-[var(--color-border)]`) and clean whitespace.
- **Nested Border Radius Mathematics**:
  $$\text{Inner Radius} = \text{Outer Radius} - \text{Padding}$$
- **Single-Line Control Labels**: Text inside buttons, tabs, pills, and badges sits on ONE line (`white-space: nowrap`).

---

## 4. Performance & Motion Standards

- **GPU Acceleration**: Animate ONLY `transform` (x, y, scale) and `opacity`. Never animate `width`, `height`, `margin`, `padding`, or `top/left` properties.
- **Reduced Motion**: All animated components must support `prefers-reduced-motion` through `getReducedMotionVariant()`.
- **Prevent Re-render Cascades**: Pass primitive selectors to Zustand stores (`useThemeStore(state => state.theme)`) rather than pulling the entire store object when observing single properties.

---

## 5. AI Execution Guidelines for Assistant

- Inspect file contents (`view_file`) before editing.
- Always run `compile_applet` and `lint_applet` after modifying code to guarantee clean build states.
- Follow the modular structure without consolidating code into giant single-file monoliths.
