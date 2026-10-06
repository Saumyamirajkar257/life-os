/**
 * @file types.ts
 * @description Type definitions for Composite ThemeSwitcher component.
 * @module AuraComposite/ThemeSwitcher/Types
 */

export interface ThemeSwitcherProps {
  variant?: 'segmented' | 'dropdown' | 'grid';
  showLabels?: boolean;
  className?: string;
}
