/**
 * @file types.ts
 * @description Type definitions for Composite SettingRow component.
 * @module AuraComposite/SettingRow/Types
 */

import { ReactNode } from 'react';

export interface SettingRowProps {
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  control: ReactNode;
  badge?: ReactNode;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
}
