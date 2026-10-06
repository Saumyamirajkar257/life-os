# PageHeader Composite Component

## Purpose
The `PageHeader` component forms the top structural header for application pages, supporting title, description, route breadcrumb trail, status indicator badge, and right-aligned action buttons.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | Required | Main page headline |
| `subtitle` | `ReactNode` | `undefined` | Secondary descriptive text |
| `breadcrumbs` | `BreadcrumbItem[]` | `undefined` | Integrated breadcrumb nodes |
| `statusBadge` | `ReactNode` | `undefined` | Live status or role tag |
| `actions` | `ReactNode` | `undefined` | Primary and secondary page action buttons |

## Usage Example
```tsx
import { PageHeader } from '@/components/composite/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

<PageHeader
  title="System Settings"
  subtitle="Manage global preferences and developer tokens."
  statusBadge={<Badge variant="success">Active</Badge>}
  actions={<Button variant="primary">Save Changes</Button>}
/>
```
