/**
 * @file types.ts
 * @description Type definitions for the CommandTrigger component.
 * @module AuraShell/CommandTrigger/Types
 */

import { ReactNode } from 'react';

export type CommandTriggerVariant = 'default' | 'compact' | 'expanded';

export interface CommandTriggerProps {
  /** Variant style of the command trigger */
  variant?: CommandTriggerVariant;

  /** Placeholder or button text */
  placeholder?: string;

  /** Keyboard shortcut text display (e.g., '⌘K' or 'Ctrl+K') */
  shortcut?: string;

  /** Click handler to open the Command Palette */
  onClick?: () => void;

  /** Custom icon override */
  icon?: ReactNode;

  /** Additional CSS classes */
  className?: string;

  /** Disable interaction */
  disabled?: boolean;
}
