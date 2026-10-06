# InfoCard Composite Component

## Purpose
The `InfoCard` component displays structured callouts with icons, variant alert themes, key-value data tables, and call-to-action buttons.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | Required | Main heading |
| `description` | `ReactNode` | `undefined` | Narrative description |
| `variant` | `'info' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Visual theme mode |
| `items` | `Array<{ label: string; value: ReactNode }>` | `[]` | Key-value list |
| `action` | `{ label: string; onClick: () => void }` | `undefined` | Action button |

## Usage Example
```tsx
import { InfoCard } from '@/components/composite/info-card';

<InfoCard
  title="Deployment Status"
  description="All services operating normally."
  variant="success"
  items={[{ label: 'Region', value: 'us-central1' }, { label: 'Uptime', value: '99.99%' }]}
/>
```
