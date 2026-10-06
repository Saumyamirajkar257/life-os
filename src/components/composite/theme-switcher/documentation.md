# ThemeSwitcher Composite Component

## Purpose
The `ThemeSwitcher` component allows users to switch between Aura OS design system themes (Midnight, Light, AMOLED, Aurora) or enable automatic System theme syncing.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'segmented' \| 'dropdown' \| 'grid'` | `'segmented'` | Layout presentation mode |
| `showLabels` | `boolean` | `true` | Toggles display of theme text names |

## Usage Example
```tsx
import { ThemeSwitcher } from '@/components/composite/theme-switcher';

<ThemeSwitcher variant="segmented" showLabels={true} />
<ThemeSwitcher variant="grid" />
```
