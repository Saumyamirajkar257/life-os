/**
 * @file types.ts
 * @description Type definitions for Composite ShortcutHint component.
 * @module AuraComposite/ShortcutHint/Types
 */

export interface ShortcutHintProps {
  keys: string[];
  size?: 'xs' | 'sm' | 'md';
  variant?: 'outline' | 'ghost' | 'solid';
  className?: string;
}
