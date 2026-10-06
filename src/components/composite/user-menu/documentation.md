# UserMenu Composite Component

## Purpose
The `UserMenu` component renders a compact user identity bar suitable for headers and sidebars, with optional collapsed state and quick action dropdowns.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | User full name |
| `email` | `string` | Required | User email address |
| `avatarUrl` | `string` | `undefined` | User avatar image URL |
| `status` | `'online' \| 'busy' \| 'away' \| 'offline'` | `'online'` | Presence status indicator |
| `badge` | `string` | `undefined` | Optional badge tag (e.g., 'Pro', 'Admin') |
| `isCollapsed` | `boolean` | `false` | Renders avatar-only variant |
| `actions` | `Array<{ label: string; icon?: ReactNode; onClick: () => void; isDanger?: boolean }>` | `[]` | List of actions in dropdown |

## Usage Example
```tsx
import { UserMenu } from '@/components/composite/user-menu';

<UserMenu
  name="Alex Rivera"
  email="alex@aura.os"
  badge="Pro"
  actions={[
    { label: 'View Profile', onClick: () => {} },
    { label: 'Log out', isDanger: true, onClick: () => {} }
  ]}
/>
```
