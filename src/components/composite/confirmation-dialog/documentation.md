# ConfirmationDialog Composite Component

## Purpose
The `ConfirmationDialog` component prompts user verification before executing high-impact state modifications.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | Required | Toggles modal visibility |
| `onClose` | `() => void` | Required | Cancels operation |
| `onConfirm` | `() => void` | Required | Triggers confirmed action |
| `title` | `ReactNode` | Required | Modal headline |
| `description` | `ReactNode` | `undefined` | Explanation text |
| `intent` | `'primary' \| 'danger' \| 'warning'` | `'primary'` | Visual intent theme |

## Usage Example
```tsx
import { ConfirmationDialog } from '@/components/composite/confirmation-dialog';

<ConfirmationDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={() => {}}
  title="Publish Changes?"
  description="This will deploy your updated theme tokens immediately."
/>
```
