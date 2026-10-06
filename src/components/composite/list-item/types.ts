/**
 * @file types.ts
 * @description Type definitions for Composite ListItem component.
 * @module AuraComposite/ListItem/Types
 */

import { ReactNode } from 'react';

export interface ListItemProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  endContent?: ReactNode;
  shortcut?: string[];
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  className?: string;
}
