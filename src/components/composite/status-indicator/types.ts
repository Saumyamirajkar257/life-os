/**
 * @file types.ts
 * @description Type definitions for Composite StatusIndicator component.
 * @module AuraComposite/StatusIndicator/Types
 */

import { ReactNode } from 'react';

export type StatusType = 'online' | 'busy' | 'away' | 'offline' | 'success' | 'warning' | 'error' | 'syncing';

export interface StatusIndicatorProps {
  status?: StatusType;
  label?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}
