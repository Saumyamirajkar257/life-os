# ActivityItem Composite Component

## Purpose
The `ActivityItem` component renders audit trail log rows with avatar/icon framing, timestamp, title, description, and status tags.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `user` | `{ name: string; avatarUrl?: string }` | `undefined` | Optional user avatar details |
| `title` | `ReactNode` | Required | Event title |
| `description` | `ReactNode` | `undefined` | Secondary details |
| `timestamp` | `string` | Required | Relative time string |
| `badge` | `ReactNode` | `undefined` | Status badge |

## Usage Example
```tsx
import { ActivityItem } from '@/components/composite/activity-item';

<ActivityItem
  user={{ name: 'Sarah Chen' }}
  title="Updated theme engine tokens"
  timestamp="12m ago"
/>
```
