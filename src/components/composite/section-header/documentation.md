# SectionHeader Composite Component

## Purpose
The `SectionHeader` component organizes subsections within cards, forms, and pages with standardized typographic hierarchy and optional bottom dividers.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | Required | Section title string |
| `description` | `ReactNode` | `undefined` | Secondary description |
| `badge` | `ReactNode` | `undefined` | Optional tag or badge |
| `action` | `ReactNode` | `undefined` | Section action control |
| `hasDivider` | `boolean` | `true` | Renders bottom rule line |

## Usage Example
```tsx
import { SectionHeader } from '@/components/composite/section-header';

<SectionHeader
  title="Security & Passwords"
  description="Configure multi-factor authentication and token lifespan."
/>
```
