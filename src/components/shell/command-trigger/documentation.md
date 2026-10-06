# CommandTrigger Component

The `CommandTrigger` component provides a search and command palette entry point for the desktop shell.

## Features
- Integrates with `useCommandPaletteStore` automatically or accepts custom `onClick`.
- Displays formatted OS shortcuts (⌘K / Ctrl+K).
- Supports `default`, `compact`, and `expanded` visual variants.
- Fully accessible with keyboard navigation and focus rings.

## Usage
```tsx
import { CommandTrigger } from '@/components/shell/command-trigger';

<CommandTrigger variant="default" placeholder="Search Aura OS..." />
```
