# LoadingScreen Composite Component

## Purpose
The `LoadingScreen` component renders full-screen or container splash loaders with animated brand iconography, initialization notes, and optional percentage progress bars.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `ReactNode` | `'Initializing...'` | Loader note text |
| `progress` | `number` | `undefined` | Optional progress bar percentage |
| `fullScreen` | `boolean` | `true` | Fixed viewport overlay mode |

## Usage Example
```tsx
import { LoadingScreen } from '@/components/composite/loading-screen';

<LoadingScreen message="Syncing design tokens..." progress={45} />
```
