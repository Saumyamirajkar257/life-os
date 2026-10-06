# TopNavigation Component

Top Navigation header for Aura Desktop Shell with sticky glassmorphism, breadcrumbs, search trigger, notification trigger, theme switcher, and profile trigger.

## Usage
```tsx
import { TopNavigation } from '@/components/shell/top-navigation';

<TopNavigation
  title="Aura Core"
  breadcrumbs={[
    { id: '1', label: 'Dashboard', href: '#' },
    { id: '2', label: 'Workspace', isCurrent: true },
  ]}
/>
```
