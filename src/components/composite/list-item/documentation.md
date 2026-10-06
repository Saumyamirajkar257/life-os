# ListItem Composite Component

## Purpose
The `ListItem` component provides interactive list items for sidebar lists, setting panels, and dropdown menus with icon framing and keyboard shortcut badges.

## Props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | Required | Main label text |
| `subtitle` | `ReactNode` | `undefined` | Secondary subtitle |
| `icon` | `ReactNode` | `undefined` | Start icon |
| `shortcut` | `string[]` | `undefined` | Keyboard shortcut badges |
| `isSelected` | `boolean` | `false` | Selected highlight state |

## Usage Example
```tsx
import { ListItem } from '@/components/composite/list-item';
import { Layers } from 'lucide-react';

<ListItem
  title="Design Tokens"
  subtitle="32 Variables"
  icon={<Layers className="w-4 h-4" />}
  shortcut={['⌘', '1']}
  isSelected={true}
/>
```
