/**
 * @file component.tsx
 * @description Global Search / Command Palette trigger button for the desktop shell.
 * @module AuraShell/CommandTrigger/Component
 */

import React from 'react';
import { Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCommandPaletteStore } from '@/stores/useCommandPaletteStore';
import { formatShortcutForOS } from '@/lib/utils/keyboard';
import { Tooltip } from '@/components/ui/tooltip';
import { CommandTriggerProps } from './types';

export const CommandTrigger: React.FC<CommandTriggerProps> = ({
  variant = 'default',
  placeholder = 'Search or command...',
  shortcut = 'meta+k',
  onClick,
  icon,
  className,
  disabled = false,
}) => {
  const { openCommandPalette } = useCommandPaletteStore();

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else {
      openCommandPalette();
    }
  };

  const formattedShortcut = formatShortcutForOS(shortcut);

  if (variant === 'compact') {
    return (
      <Tooltip content={`Search / Command (${formattedShortcut})`}>
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-label="Open Command Palette"
          className={cn(
            'p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-border)] transition-all cursor-pointer flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
        >
          {icon || <Search className="w-4 h-4 text-[var(--color-accent)]" />}
        </button>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label="Open Command Palette"
      className={cn(
        'group flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-[var(--color-surface-elevated)]/60 hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/70 hover:border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 select-none disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'expanded' ? 'w-full md:w-80' : 'w-48 sm:w-64',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon || <Search className="w-3.5 h-3.5 text-[var(--color-accent)] group-hover:scale-110 transition-transform shrink-0" />}
        <span className="truncate font-medium">{placeholder}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] shadow-xs transition-colors flex items-center gap-0.5">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </kbd>
      </div>
    </button>
  );
};
