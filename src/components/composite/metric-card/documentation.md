# MetricCard Composite Component

## Purpose
The `MetricCard` component displays key-value pairs, subvalues, and status highlight borders for compact dashboard panels.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | Required | Metric label |
| `value` | `ReactNode` | Required | Primary value figure |
| `subvalue` | `ReactNode` | `undefined` | Secondary comparative value |
| `status` | `'success' \| 'warning' \| 'error' \| 'info'` | `undefined` | Border color state |

## Usage Example
```tsx
import { MetricCard } from '@/components/composite/metric-card';

<MetricCard label="Latency" value="12ms" subvalue="p99: 18ms" status="success" />
```
