/**
 * @file types.ts
 * @description Type definitions for Aura UI Tabs component.
 * @module AuraUI/Tabs/Types
 */

import { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId?: string;
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
