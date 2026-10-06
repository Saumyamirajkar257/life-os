# Breadcrumbs Composite Component

## Purpose
The `Breadcrumbs` component displays hierarchical navigation paths with automatic overflow collapse when exceeding `maxItems`, custom separators, route icons, and keyboard focus states.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | Required | Array of route path nodes |
| `maxItems` | `number` | `4` | Threshold before collapsing intermediate nodes |
| `separator` | `ReactNode` | `<ChevronRight />` | Divider element between nodes |
| `showHomeIcon` | `boolean` | `true` | Renders root Home button |
| `onHomeClick` | `() => void` | `undefined` | Callback for root Home navigation |

## Usage Example
```tsx
import { Breadcrumbs } from '@/components/composite/breadcrumbs';

<Breadcrumbs
  items={[
    { id: '1', label: 'Workspace', onClick: () => {} },
    { id: '2', label: 'Design System', onClick: () => {} },
    { id: '3', label: 'Tokens', onClick: () => {} },
    { id: '4', label: 'Color Variables' }
  ]}
  maxItems={3}
/>
```
