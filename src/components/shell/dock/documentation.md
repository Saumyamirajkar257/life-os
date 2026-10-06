# Dock Component

Floating desktop dock with macOS style magnification hover physics, active dot indicators, badges, and quick app access.

## Usage
```tsx
import { Dock } from '@/components/shell/dock';

<Dock
  activeItemId="dashboard"
  onSelectItemId={(id) => setView(id)}
/>
```
