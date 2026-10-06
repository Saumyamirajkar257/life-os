/**
 * @file component.tsx
 * @description Desktop Workspace canvas container supporting multi-pane layouts, workspace switching, and responsive panel management.
 * @module AuraShell/Workspace/Component
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Columns2, Grid2X2, Square, Sparkles, ChevronDown, Layers, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Dropdown } from '@/components/ui/dropdown';
import { Tooltip } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { springTransitions } from '@/animations/transitions';
import { WorkspaceProps, WorkspaceLayoutMode, WorkspaceItem } from './types';

const DEFAULT_WORKSPACES: WorkspaceItem[] = [
  { id: 'core', name: 'Aura Workspace', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'Active' },
  { id: 'analytics', name: 'Performance Workspace', icon: <Layers className="w-4 h-4" /> },
  { id: 'settings', name: 'System Settings', icon: <Sparkles className="w-4 h-4" /> },
];

export const Workspace: React.FC<WorkspaceProps> = ({
  activeWorkspaceId = 'core',
  workspaces = DEFAULT_WORKSPACES,
  onWorkspaceChange,
  layoutMode: customLayoutMode,
  onLayoutModeChange,
  secondaryPaneContent,
  headerActions,
  children,
  className,
}) => {
  const [internalLayoutMode, setInternalLayoutMode] = useState<WorkspaceLayoutMode>('single');
  const [selectedWsId, setSelectedWsId] = useState(activeWorkspaceId);

  const layoutMode = customLayoutMode !== undefined ? customLayoutMode : internalLayoutMode;
  const currentWorkspace = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const handleLayoutModeChange = (mode: WorkspaceLayoutMode) => {
    if (onLayoutModeChange) onLayoutModeChange(mode);
    else setInternalLayoutMode(mode);
  };

  const handleSelectWorkspace = (wsId: string) => {
    setSelectedWsId(wsId);
    if (onWorkspaceChange) onWorkspaceChange(wsId);
  };

  const dropdownItems = workspaces.map((w) => ({
    id: w.id,
    label: w.name,
    icon: w.icon,
    onClick: () => handleSelectWorkspace(w.id),
  }));

  return (
    <div className={cn('flex-1 flex flex-col w-full h-full min-h-0 bg-[var(--color-bg)] overflow-hidden', className)}>
      {/* Workspace Bar Header */}
      <div className="h-11 px-4 border-b border-[var(--color-border)]/20 bg-transparent flex items-center justify-between gap-3 shrink-0 z-10 select-none">
        {/* Workspace Switcher */}
        <Dropdown
          align="left"
          items={dropdownItems}
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-elevated)]/80 border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-primary)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
            >
              {currentWorkspace.icon}
              <span className="truncate max-w-[180px] sm:max-w-[240px]">{currentWorkspace.name}</span>
              {currentWorkspace.badge && (
                <Badge variant="accent" size="sm">
                  {currentWorkspace.badge}
                </Badge>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
            </button>
          }
        />

        {/* Header Center / Actions */}
        <div className="flex items-center gap-2">
          {headerActions}

          {/* Layout Mode Switchers */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs">
            <Tooltip content="Single Pane View">
              <button
                type="button"
                onClick={() => handleLayoutModeChange('single')}
                aria-label="Single Pane View"
                className={cn(
                  'p-1 rounded-lg transition-colors cursor-pointer',
                  layoutMode === 'single'
                    ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                )}
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            {secondaryPaneContent && (
              <>
                <Tooltip content="Split Side-by-Side View">
                  <button
                    type="button"
                    onClick={() => handleLayoutModeChange('split')}
                    aria-label="Split Side-by-Side View"
                    className={cn(
                      'p-1 rounded-lg transition-colors cursor-pointer',
                      layoutMode === 'split'
                        ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-xs'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                    )}
                  >
                    <Columns2 className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>

                <Tooltip content="Grid View">
                  <button
                    type="button"
                    onClick={() => handleLayoutModeChange('grid')}
                    aria-label="Grid View"
                    className={cn(
                      'p-1 rounded-lg transition-colors cursor-pointer',
                      layoutMode === 'grid'
                        ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-xs'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                    )}
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout Canvas */}
      <div className="flex-1 w-full h-full min-h-0 flex overflow-hidden">
        {/* Primary Pane */}
        <div
          className={cn(
            'flex-1 h-full min-h-0 flex flex-col transition-all duration-300 overflow-hidden',
            layoutMode === 'split' ? 'w-1/2 border-r border-[var(--color-border)]' : '',
            layoutMode === 'grid' ? 'w-1/2 h-1/2 border-r border-b border-[var(--color-border)]' : 'w-full'
          )}
        >
          {children}
        </div>

        {/* Secondary Pane for Split / Grid */}
        {secondaryPaneContent && layoutMode !== 'single' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={springTransitions.gentle}
            className={cn(
              'flex-1 h-full min-h-0 flex flex-col bg-[var(--color-surface-elevated)]/40 overflow-hidden',
              layoutMode === 'split' ? 'w-1/2' : '',
              layoutMode === 'grid' ? 'w-1/2' : ''
            )}
          >
            {secondaryPaneContent}
          </motion.div>
        )}
      </div>
    </div>
  );
};
