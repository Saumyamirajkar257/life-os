# ProfileMenu Composite Component

## Purpose
The `ProfileMenu` component provides user profile identity management, online presence indicator, integrated theme selector, settings shortcuts, and account log out actions.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `user` | `UserProfile` | Required | User profile details (name, email, avatarUrl, role, status) |
| `onOpenPreferences` | `() => void` | `undefined` | Triggers user preference dialog/drawer |
| `onOpenSettings` | `() => void` | `undefined` | Triggers account settings navigation |
| `onLogout` | `() => void` | `undefined` | Handles account sign-out flow |
| `customActions` | `Array<{ id: string; label: string; icon?: ReactNode; onClick: () => void }>` | `[]` | Additional custom menu links |

## Usage Example
```tsx
import { ProfileMenu } from '@/components/composite/profile-menu';

<ProfileMenu
  user={{
    name: 'Aura Architect',
    email: 'architect@aura.os',
    role: 'Lead Developer',
    status: 'online',
  }}
  onOpenPreferences={() => console.log('Open preferences')}
  onOpenSettings={() => console.log('Open settings')}
  onLogout={() => console.log('Log out')}
/>
```
