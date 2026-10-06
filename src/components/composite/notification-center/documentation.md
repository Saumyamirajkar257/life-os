# NotificationCenter Composite Component

## Purpose
The `NotificationCenter` component displays grouped real-time user notifications, unread badges, skeletons during loading, empty states, and batch clearance operations.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `notifications` | `NotificationItem[]` | Required | Array of notification items |
| `isLoading` | `boolean` | `false` | Renders loading skeleton list |
| `onMarkAsRead` | `(id: string) => void` | `undefined` | Marks individual item read |
| `onMarkAllAsRead` | `() => void` | `undefined` | Marks all items read |
| `onClearAll` | `() => void` | `undefined` | Clears notification queue |

## Usage Example
```tsx
import { NotificationCenter } from '@/components/composite/notification-center';

<NotificationCenter
  notifications={[
    { id: '1', title: 'System Updated', description: 'Aura OS Milestone 6 active.', time: '2m ago', isRead: false, type: 'success' },
    { id: '2', title: 'Security Alert', description: 'New device sign in detected.', time: '1h ago', isRead: true, type: 'warning' }
  ]}
  onMarkAllAsRead={() => {}}
/>
```
