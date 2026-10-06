/**
 * @file component.tsx
 * @description Composite SearchBar with instant filtering, keyboard shortcut, loading state, recent search history, and suggestion popup.
 * @module AuraComposite/SearchBar/Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { springTransitions } from '@/animations/transitions';
import { SearchBarProps, SearchSuggestion } from './types';

export const SearchBar: React.FC<SearchBarProps> = ({
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search anything in Aura...',
  isLoading = false,
  shortcutHint = '⌘K',
  recentSearches = [],
  onSelectRecent,
  onClearRecent,
  suggestions = [],
  onSelectSuggestion,
  className,
  autoFocus = false,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (controlledValue === undefined) {
      setUncontrolledValue(val);
    }
    onChange?.(val);
    onSearch?.(val);
    setIsOpen(true);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setUncontrolledValue('');
    }
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasQuery = value.trim().length > 0;
  const showRecent = !hasQuery && recentSearches.length > 0 && isOpen;
  const showSuggestions = hasQuery && suggestions.length > 0 && isOpen;
  const showEmptySuggestions = hasQuery && suggestions.length === 0 && !isLoading && isOpen;

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-xl', className)}>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          leftIcon={<Search className="w-4 h-4 text-[var(--color-text-muted)]" />}
          rightIcon={
            <div className="flex items-center gap-1.5 pr-1">
              {isLoading && <Spinner size="sm" color="accent" />}
              {hasQuery && !isLoading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {shortcutHint && !hasQuery && (
                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md shadow-2xs">
                  {shortcutHint}
                </kbd>
              )}
            </div>
          }
        />
      </div>

      {/* Popover overlay for Recent Searches or Suggestions */}
      <AnimatePresence>
        {(showRecent || showSuggestions || showEmptySuggestions) && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={springTransitions.snappy}
            className="absolute left-0 right-0 z-40 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Recent Searches */}
            {showRecent && (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Recent Searches
                  </span>
                  {onClearRecent && (
                    <button
                      type="button"
                      onClick={onClearRecent}
                      className="text-[10px] hover:text-[var(--color-error)] transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-0.5">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (controlledValue === undefined) setUncontrolledValue(item);
                        onChange?.(item);
                        onSearch?.(item);
                        onSelectRecent?.(item);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface-elevated)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{item}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)] font-mono">Select</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && (
              <div className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[var(--color-accent)]" /> Suggestions
                </div>
                <div className="space-y-0.5">
                  {suggestions.map((sug) => (
                    <button
                      key={sug.id}
                      type="button"
                      onClick={() => {
                        onSelectSuggestion?.(sug);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface-elevated)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {sug.icon && <span className="text-[var(--color-text-muted)]">{sug.icon}</span>}
                        <span>{sug.label}</span>
                      </div>
                      {sug.category && (
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]">
                          {sug.category}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty Suggestions */}
            {showEmptySuggestions && (
              <div className="p-4 text-center text-xs text-[var(--color-text-muted)] font-mono">
                No matches found for "{value}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
