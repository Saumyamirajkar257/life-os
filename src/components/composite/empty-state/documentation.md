# Composite EmptyState Component

## Purpose
The `CompositeEmptyState` component wraps the base `EmptyState` primitive with contextual domain presets (`search`, `list`, `table`, `dashboard`, `module`, `offline`, `error`).

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `preset` | `EmptyStatePreset` | `'list'` | Contextual preset icon/copy configuration |
| `title` | `ReactNode` | Preset default | Overrides preset title |
| `description` | `ReactNode` | Preset default | Overrides preset description |
| `action` | `{ label: string; onClick: () => void }` | `undefined` | Primary action button |
| `secondaryAction` | `{ label: string; onClick: () => void }` | `undefined` | Secondary action button |

## Usage Example
```tsx
import { CompositeEmptyState } from '@/components/composite/empty-state';

<CompositeEmptyState
  preset="search"
  action={{ label: 'Reset Filters', onClick: () => {} }}
/>
```
