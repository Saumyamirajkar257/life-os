/**
 * @file component.tsx
 * @description Composite CommandPalette (⌘K) with keyboard navigation, search filtering, category grouping, and key shortcuts.
 * @module AuraComposite/CommandPalette/Component
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Sparkles, Command, ArrowDown, ArrowUp, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { Modal } from '@/components/ui/modal';
import { ShortcutHint } from '../shortcut-hint';
import { springTransitions } from '@/animations/transitions';
import { CommandPaletteProps, CommandAction } from './types';

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  actions,
  recentActionIds = [],
  placeholder = 'Type a command or search...',
  className,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter actions based on query
  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        a.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  }, [actions, query]);

  // Group by Category
  const groupedActions = useMemo(() => {
    const groups: Record<string, CommandAction[]> = {};

    // First add Recent if no query and recentActionIds exist
    if (!query.trim() && recentActionIds.length > 0) {
      const recents = actions.filter((a) => recentActionIds.includes(a.id));
      if (recents.length > 0) {
        groups['Recent Actions'] = recents;
      }
    }

    filteredActions.forEach((act) => {
      const cat = act.category || 'Commands';
      if (!groups[cat]) groups[cat] = [];
      // avoid duplicating if already in recent and no query
      if (!(!query.trim() && recentActionIds.includes(act.id) && groups['Recent Actions'])) {
        groups[cat].push(act);
      }
    });

    return groups;
  }, [filteredActions, query, recentActionIds, actions]);

  // Flattened array for index calculation
  const flatList = useMemo(() => {
    return Object.values(groupedActions).flat();
  }, [groupedActions]);

  // Reset index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatList.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatList.length) % Math.max(1, flatList.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = flatList[selectedIndex];
        if (selected) {
          selected.onSelect();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatList, selectedIndex, onClose]);

  // Global trigger ⌘K / Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
          // trigger open handled by parent state or toggle
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className={cn('p-0 overflow-hidden', className)}>
      <div className="flex flex-col max-h-[520px]">
        {/* Search Header */}
        <div className="relative flex items-center border-b border-[var(--color-border)] p-4 bg-[var(--color-surface)]">
          <Search className="w-5 h-5 text-[var(--color-accent)] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoFocus
            className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded bg-[var(--color-surface-elevated)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Command List Area */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {flatList.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--color-text-muted)] font-mono">
              No matching commands found for "{query}"
            </div>
          ) : (
            Object.entries(groupedActions).map(([category, items]) => (
              <div key={category} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] font-bold">
                  {category}
                </div>

                <div className="space-y-0.5">
                  {items.map((act) => {
                    const globalIdx = flatList.indexOf(act);
                    const isSelected = globalIdx === selectedIndex;

                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => {
                          act.onSelect();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left',
                          isSelected
                            ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)] font-bold'
                            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {act.icon && (
                            <span className={cn('shrink-0', isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]')}>
                              {act.icon}
                            </span>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">{act.label}</span>
                            {act.description && (
                              <span className="text-[10px] font-normal text-[var(--color-text-muted)] truncate">
                                {act.description}
                              </span>
                            )}
                          </div>
                        </div>

                        {act.shortcut && <ShortcutHint keys={act.shortcut} size="xs" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[9px]">
                <ArrowUp className="w-2.5 h-2.5 inline" />
              </kbd>
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[9px]">
                <ArrowDown className="w-2.5 h-2.5 inline" />
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[9px]">
                <CornerDownLeft className="w-2.5 h-2.5 inline" />
              </kbd>
              Select
            </span>
          </div>

          <span className="flex items-center gap-1">
            <Command className="w-3 h-3 text-[var(--color-accent)]" /> Aura OS Palette
          </span>
        </div>
      </div>
    </Modal>
  );
};
