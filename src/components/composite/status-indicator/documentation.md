# StatusIndicator Composite Component

## Purpose
The `StatusIndicator` component renders status dots with live ambient ping pulses, custom labels, and status themes (`online`, `busy`, `away`, `offline`, `syncing`, `error`, `success`).

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `StatusType` | `'online'` | Status state enum |
| `label` | `ReactNode` | Config default | Status description string |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Scale size |
| `showPulse` | `boolean` | `true` | Toggles animated pulsing ring effect |

## Usage Example
```tsx
import { StatusIndicator } from '@/components/composite/status-indicator';

<StatusIndicator status="online" label="All Systems Operational" />
<StatusIndicator status="syncing" label="Syncing Cloud Storage..." size="sm" />
```
