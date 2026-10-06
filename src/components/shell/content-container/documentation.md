# ContentContainer Component

Responsive content container with scroll management, max-width constraints, scroll-to-top button, and page transition animations.

## Usage
```tsx
import { ContentContainer } from '@/components/shell/content-container';

<ContentContainer maxWidth="7xl" viewKey={currentViewId}>
  {children}
</ContentContainer>
```
