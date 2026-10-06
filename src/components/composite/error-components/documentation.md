# ErrorComponents Composite Component

## Purpose
The `ErrorStateView` component presents dedicated error screens for HTTP and application error scenarios (`404`, `500`, `network`, `unauthorized`, `generic`).

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'generic' \| 'network' \| '404' \| '500' \| 'unauthorized'` | `'generic'` | Error classification preset |
| `title` | `ReactNode` | Preset default | Overrides error headline |
| `description` | `ReactNode` | Preset default | Overrides error explanation |
| `onRetry` | `() => void` | `undefined` | Callback for retry button |
| `onGoHome` | `() => void` | `undefined` | Callback for home navigation button |

## Usage Example
```tsx
import { ErrorStateView } from '@/components/composite/error-components';

<ErrorStateView
  type="404"
  onGoHome={() => window.location.href = '/'}
/>
```
