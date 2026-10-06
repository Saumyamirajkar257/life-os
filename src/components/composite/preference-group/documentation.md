# PreferenceGroup Composite Component

## Purpose
The `PreferenceGroup` component wraps collections of `SettingRow` items into unified card groups with uppercase mono headers and descriptive text.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | Required | Group header text |
| `description` | `ReactNode` | `undefined` | Subtitle description |
| `children` | `ReactNode` | Required | Setting rows or controls |
| `action` | `ReactNode` | `undefined` | Optional section action button |

## Usage Example
```tsx
import { PreferenceGroup } from '@/components/composite/preference-group';
import { SettingRow } from '@/components/composite/setting-row';
import { Switch } from '@/components/ui/switch';

<PreferenceGroup title="Interface Preferences">
  <SettingRow label="Compact View" control={<Switch checked={false} onChange={() => {}} />} />
</PreferenceGroup>
```
