# SettingRow Composite Component

## Purpose
The `SettingRow` component presents individual settings and preferences with left icon framing, label, secondary description text, tooltip hints, badges, and right-aligned interactive controls (Switch, Select, Input, etc.).

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | Required | Setting title |
| `description` | `ReactNode` | `undefined` | Secondary guidance |
| `icon` | `ReactNode` | `undefined` | Icon element |
| `control` | `ReactNode` | Required | Interactive input control (e.g., Switch) |
| `badge` | `ReactNode` | `undefined` | Badge or tag |
| `tooltip` | `string` | `undefined` | Hover tooltip text |
| `disabled` | `boolean` | `false` | Disables interaction |

## Usage Example
```tsx
import { SettingRow } from '@/components/composite/setting-row';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

<SettingRow
  label="Push Notifications"
  description="Receive alerts for system milestones."
  icon={<Bell className="w-4 h-4" />}
  control={<Switch checked={true} onChange={() => {}} />}
/>
```
