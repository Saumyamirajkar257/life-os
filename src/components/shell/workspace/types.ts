/**
 * @file types.ts
 * @description Type definitions for the Workspace component.
 * @module AuraShell/Workspace/Types
 */

import { ReactNode } from 'react';

export type WorkspaceLayoutMode = 'single' | 'split' | 'grid';

export interface WorkspaceItem {
  id: string;
  name: string;
  icon?: ReactNode;
  description?: string;
  badge?: string;
}

export interface WorkspaceProps {
  /** Active workspace details or ID */
  activeWorkspaceId?: string;

  /** List of available workspaces */
  workspaces?: WorkspaceItem[];

  /** Callback when workspace is changed */
  onWorkspaceChange?: (workspaceId: string) => void;

  /** Layout split mode ('single' | 'split' | 'grid') */
  layoutMode?: WorkspaceLayoutMode;

  /** Callback when layout mode changed */
  onLayoutModeChange?: (mode: WorkspaceLayoutMode) => void;

  /** Secondary pane content for split / grid view */
  secondaryPaneContent?: ReactNode;

  /** Custom workspace header controls */
  headerActions?: ReactNode;

  /** Main content inside workspace */
  children: ReactNode;

  /** Additional CSS classes */
  className?: string;
}
