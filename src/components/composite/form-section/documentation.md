# FormSection Composite Component

## Purpose
The `FormSection` component groups form inputs inside a token-driven card with integrated header titles, form descriptions, loading overlays, and action footers.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | Required | Header section title |
| `description` | `ReactNode` | `undefined` | Header subtitle/instructions |
| `children` | `ReactNode` | Required | Form inputs and setting controls |
| `footerActions` | `ReactNode` | `undefined` | Submit/Cancel action buttons |
| `isLoading` | `boolean` | `false` | Shows loading overlay |

## Usage Example
```tsx
import { FormSection } from '@/components/composite/form-section';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

<FormSection
  title="Profile Details"
  description="Update your display name and email address."
  footerActions={<Button variant="primary">Save Changes</Button>}
>
  <Input label="Full Name" defaultValue="Alex Rivera" />
</FormSection>
```
