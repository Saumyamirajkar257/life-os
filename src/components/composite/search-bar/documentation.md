# SearchBar Composite Component

## Purpose
The `SearchBar` component provides instant query filtering, keyboard shortcut hints, recent search history dropdowns, suggestions overlays, clear actions, and loading states built on primitive Aura UI elements.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `undefined` | Controlled search input string |
| `onChange` | `(val: string) => void` | `undefined` | Callback fired on value change |
| `onSearch` | `(val: string) => void` | `undefined` | Callback fired when user triggers search |
| `onClear` | `() => void` | `undefined` | Callback fired when clear button is pressed |
| `isLoading` | `boolean` | `false` | Shows spinner in input right icon area |
| `shortcutHint` | `string` | `'⌘K'` | Keyboard shortcut badge displayed when input is empty |
| `recentSearches` | `string[]` | `[]` | List of recent search queries to display in popover |
| `suggestions` | `SearchSuggestion[]` | `[]` | List of suggestions to display when typing |

## Usage Example
```tsx
import { SearchBar } from '@/components/composite/search-bar';

<SearchBar
  placeholder="Search workspace..."
  shortcutHint="⌘K"
  recentSearches={['Design Tokens', 'Motion Physics', 'Aura Core']}
  suggestions={[
    { id: '1', label: 'Theme Switcher', category: 'Component' },
    { id: '2', label: 'Command Palette', category: 'Feature' }
  ]}
  onSearch={(query) => console.log('Search:', query)}
/>
```

## Accessibility & Best Practices
- Input is paired with accessible `aria-label` buttons for clearing.
- Keyboard navigation compliant for list selection.
- Works across dark, light, midnight, and AMOLED themes seamlessly.
