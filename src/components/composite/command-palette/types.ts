/**
 * @file types.ts
 * @description Type definitions for Composite CommandPalette component.
 * @module AuraComposite/CommandPalette/Types
 */

import { ReactNode } from 'react';

export interface CommandAction {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  category?: string;
  shortcut?: string[];
  keywords?: string[];
  onSelect: () => void;
  isDanger?: boolean;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: CommandAction[];
  recentActionIds?: string[];
  placeholder?: string;
  className?: string;
}
