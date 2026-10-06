# Sidebar Component

Premium desktop sidebar navigation with support for collapse/expand (`⌘B`), resize dragging, pinned state, section groups, badges, keyboard navigation, and Framer Motion active indicators.

## Features
- Resizable sidebar width with drag handle
- Pinned and unpinned mode
- Keyboard shortcuts (`⌘B`)
- Grouped navigation sections with collapsible headers
- Active section tab indicator with Framer Motion layout animations
- Tooltips when collapsed

## Usage
```tsx
import { Sidebar } from '@/components/shell/sidebar';

<Sidebar
  activeItemId="dashboard"
  onSelectItemId={(id) => console.log('Selected section:', id)}
/>
```
