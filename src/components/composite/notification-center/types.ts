/**
 * @file types.ts
 * @description Type definitions for Composite NotificationCenter component.
 * @module AuraComposite/NotificationCenter/Types
 */

import { ReactNode } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  isRead: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: ReactNode;
  category?: string;
  action?: { label: string; onClick: () => void };
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  isLoading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  onNotificationClick?: (item: NotificationItem) => void;
  className?: string;
}
