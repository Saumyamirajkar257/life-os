# ShortcutHint Composite Component

## Purpose
The `ShortcutHint` component renders styled visual keyboard combination badges (`<kbd>`) for hotkeys and shortcut hints across dialogs, menus, and command palettes.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `keys` | `string[]` | Required | Key symbols sequence (e.g., `['⌘', 'K']` or `['Ctrl', 'Shift', 'P']`) |
| `size` | `'xs' \| 'sm' \| 'md'` | `'sm'` | Size scale of badges |
| `variant` | `'outline' \| 'ghost' \| 'solid'` | `'outline'` | Visual badge style |

## Usage Example
```tsx
import { ShortcutHint } from '@/components/composite/shortcut-hint';

<ShortcutHint keys={['⌘', 'K']} size="sm" />
<ShortcutHint keys={['Ctrl', 'Shift', 'F']} size="md" variant="solid" />
```
