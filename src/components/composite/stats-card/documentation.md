# StatsCard Composite Component

## Purpose
The `StatsCard` component presents primary quantitative metrics with delta percentage badges, target progress bars, icon framing, and secondary period labels.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | Required | Metric label |
| `value` | `ReactNode` | Required | Main stat figure |
| `change` | `{ value: string \| number; type: 'positive' \| 'negative' \| 'neutral'; period?: string }` | `undefined` | Delta trend data |
| `icon` | `ReactNode` | `undefined` | Card corner icon |
| `progress` | `number` | `undefined` | Progress percentage bar (0-100) |
| `footer` | `ReactNode` | `undefined` | Bottom metadata note |

## Usage Example
```tsx
import { StatsCard } from '@/components/composite/stats-card';
import { Activity } from 'lucide-react';

<StatsCard
  title="Active Workflows"
  value="1,428"
  change={{ value: '+14.2%', type: 'positive' }}
  progress={78}
  icon={<Activity className="w-4 h-4" />}
/>
```
