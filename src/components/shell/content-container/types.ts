/**
 * @file types.ts
 * @description Type definitions for ContentContainer component.
 * @module AuraShell/ContentContainer/Types
 */

import { ReactNode } from 'react';

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';

export interface ContentContainerProps {
  /** Main content elements */
  children: ReactNode;

  /** Maximum width constraint */
  maxWidth?: ContainerMaxWidth;

  /** Padding size preset */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /** Key to trigger smooth motion transition on route/view change */
  viewKey?: string;

  /** Show scroll to top floating action button when scrolled down */
  showScrollToTop?: boolean;

  /** Enable custom scroll management and scroll shadows */
  scrollable?: boolean;

  /** Additional CSS classes */
  className?: string;
}
