/**
 * @file types.ts
 * @description Type definitions for Composite UserMenu component.
 * @module AuraComposite/UserMenu/Types
 */

import { ReactNode } from 'react';

export interface UserMenuProps {
  name: string;
  email: string;
  avatarUrl?: string;
  status?: 'online' | 'busy' | 'away' | 'offline';
  badge?: string;
  isCollapsed?: boolean;
  onClick?: () => void;
  actions?: Array<{ label: string; icon?: ReactNode; onClick: () => void; isDanger?: boolean }>;
  className?: string;
}
