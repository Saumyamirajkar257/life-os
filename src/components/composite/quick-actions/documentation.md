# QuickActions Composite Component

## Purpose
The `QuickActions` component presents key application shortcuts and quick workflow triggers in grid or horizontal bar layouts.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `actions` | `ActionItem[]` | Required | List of action buttons |
| `layout` | `'grid' \| 'bar'` | `'grid'` | Presentation layout |

## Usage Example
```tsx
import { QuickActions } from '@/components/composite/quick-actions';
import { Plus, Terminal } from 'lucide-react';

<QuickActions
  actions={[
    { id: '1', label: 'New Task', icon: <Plus className="w-4 h-4" />, shortcut: ['N'], onClick: () => {} },
    { id: '2', label: 'Open Terminal', icon: <Terminal className="w-4 h-4" />, shortcut: ['⌥', 'T'], onClick: () => {} }
  ]}
/>
```
