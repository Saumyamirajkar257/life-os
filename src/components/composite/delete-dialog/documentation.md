# DeleteDialog Composite Component

## Purpose
The `DeleteDialog` component provides destructive deletion confirmation requiring keyword string input matching to prevent accidental data loss.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | Required | Toggles modal visibility |
| `onClose` | `() => void` | Required | Cancels modal |
| `onDelete` | `() => void` | Required | Triggers deletion callback |
| `itemName` | `string` | Required | Name of target item being deleted |
| `requireMatchText` | `boolean` | `true` | Enforces confirmation keyword input |
| `matchKeyword` | `string` | `'DELETE'` | Match keyword string |

## Usage Example
```tsx
import { DeleteDialog } from '@/components/composite/delete-dialog';

<DeleteDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onDelete={() => {}}
  itemName="Production Cluster"
/>
```
