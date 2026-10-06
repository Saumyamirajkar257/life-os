/**
 * @file component.tsx
 * @description Composite EmptyState providing curated presets for common application states.
 * @module AuraComposite/EmptyState/Component
 */

import React from 'react';
import { Search, Inbox, Table, LayoutGrid, Layers, WifiOff, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { EmptyState as BaseEmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { CompositeEmptyStateProps, EmptyStatePreset } from './types';

const presetDefaults: Record<EmptyStatePreset, { icon: React.ReactNode; title: string; description: string }> = {
  search: {
    icon: <Search className="w-8 h-8 text-[var(--color-accent)]" />,
    title: 'No search results found',
    description: 'Try refining your query or resetting filter parameters.',
  },
  list: {
    icon: <Inbox className="w-8 h-8 text-[var(--color-accent)]" />,
    title: 'Your list is empty',
    description: 'No items created yet. Get started by adding a new record.',
  },
  table: {
    icon: <Table className="w-8 h-8 text-[var(--color-accent)]" />,
    title: 'No tabular data available',
    description: 'Data will populate here once events are ingested.',
  },
  dashboard: {
    icon: <LayoutGrid className="w-8 h-8 text-[var(--color-accent)]" />,
    title: 'No metrics configured',
    description: 'Pin widgets from the command palette to customize your dashboard.',
  },
  module: {
    icon: <Layers className="w-8 h-8 text-[var(--color-accent)]" />,
    title: 'Module inactive',
    description: 'Enable this primitive module in system settings to unlock views.',
  },
  offline: {
    icon: <WifiOff className="w-8 h-8 text-amber-500" />,
    title: 'You are currently offline',
    description: 'Check your internet connection to sync real-time records.',
  },
  error: {
    icon: <AlertOctagon className="w-8 h-8 text-rose-500" />,
    title: 'Unable to load content',
    description: 'An unexpected exception occurred while querying the server.',
  },
};

export const CompositeEmptyState: React.FC<CompositeEmptyStateProps> = ({
  preset = 'list',
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
}) => {
  const defaults = presetDefaults[preset];

  const actionButtons = (action || secondaryAction) ? (
    <div className="flex items-center justify-center gap-2 pt-2">
      {secondaryAction && (
        <Button variant="outline" size="sm" onClick={secondaryAction.onClick}>
          {secondaryAction.label}
        </Button>
      )}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  ) : undefined;

  return (
    <BaseEmptyState
      icon={icon || defaults.icon}
      title={title || defaults.title}
      description={description || defaults.description}
      action={actionButtons}
      className={className}
    />
  );
};
