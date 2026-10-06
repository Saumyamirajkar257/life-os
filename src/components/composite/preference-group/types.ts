/**
 * @file types.ts
 * @description Type definitions for Composite PreferenceGroup component.
 * @module AuraComposite/PreferenceGroup/Types
 */

import { ReactNode } from 'react';

export interface PreferenceGroupProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}
