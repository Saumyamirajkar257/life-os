# CommandPalette Composite Component

## Purpose
The `CommandPalette` component provides Raycast/Linear style command modal access (`⌘K` / `Ctrl+K`) with instant filtering, grouped categories, recent actions, and full arrow/Enter keyboard accessibility.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | Required | Toggles palette modal visibility |
| `onClose` | `() => void` | Required | Callback when palette closes |
| `actions` | `CommandAction[]` | Required | Array of executable command items |
| `recentActionIds` | `string[]` | `[]` | List of IDs prioritized under Recent Actions |
| `placeholder` | `string` | `'Type a command...'` | Search input placeholder |

## Usage Example
```tsx
import { CommandPalette } from '@/components/composite/command-palette';

<CommandPalette
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  actions={[
    { id: '1', label: 'Toggle Dark Mode', category: 'Theme', shortcut: ['⌘', 'D'], onSelect: () => {} },
    { id: '2', label: 'Go to Settings', category: 'Navigation', shortcut: ['G', 'S'], onSelect: () => {} }
  ]}
/>
```
