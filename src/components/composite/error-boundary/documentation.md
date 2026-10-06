# ErrorBoundary Composite Component

## Purpose
The `ErrorBoundary` component intercepts uncaught runtime errors across component subtrees, rendering fallback cards with stack traces, copy log actions, and reload state resets.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Required | Application component tree |
| `fallback` | `ReactNode` | `undefined` | Custom fallback element |
| `onError` | `(error, errorInfo) => void` | `undefined` | Error logging callback |

## Usage Example
```tsx
import { ErrorBoundary } from '@/components/composite/error-boundary';

<ErrorBoundary onError={(err) => console.error(err)}>
  <DashboardView />
</ErrorBoundary>
```
