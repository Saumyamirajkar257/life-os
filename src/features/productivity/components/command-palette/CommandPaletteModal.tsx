/**
 * @file CommandPaletteModal.tsx
 * @description Accessible Command Palette & Global Search Modal (⌘K / Ctrl+K).
 * Features arrow key navigation, fuzzy search, categories, recent searches, pinned commands, and SDK module search aggregation.
 * @module Features/Productivity/Components/CommandPalette/CommandPaletteModal
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Command,
  X,
  Pin,
  Clock,
  CheckSquare,
  Flame,
  CreditCard,
  Settings,
  Sparkles,
  ArrowRight,
  Sliders,
  Bell,
  User,
  Moon,
  Trash2,
} from 'lucide-react';
import { useProductivityStore } from '../../stores/useProductivityStore';
import { executeGlobalSearch } from '../../services/searchEngine';
import { CommandItem, SearchResultItem } from '../../types';

interface CommandPaletteModalProps {
  onNavigate?: (path: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ onNavigate }) => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    pinnedCommandIds,
    togglePinCommand,
  } = useProductivityStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // System level built-in commands
  const defaultCommands: CommandItem[] = useMemo(
    () => [
      {
        id: 'cmd-tasks-nav',
        title: 'Open Tasks & Projects',
        subtitle: 'Navigate to task management board',
        category: 'Navigation',
        icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
        shortcut: '⌘1',
        action: () => {
          onNavigate?.('/tasks');
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'cmd-habits-nav',
        title: 'Open Habits & Routines',
        subtitle: 'View daily streak tracker',
        category: 'Navigation',
        icon: <Flame className="w-4 h-4 text-amber-400" />,
        shortcut: '⌘2',
        action: () => {
          onNavigate?.('/habits');
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'cmd-finance-nav',
        title: 'Open Finance & Wealth',
        subtitle: 'Check account cashflow & budgets',
        category: 'Navigation',
        icon: <CreditCard className="w-4 h-4 text-blue-400" />,
        shortcut: '⌘3',
        action: () => {
          onNavigate?.('/finance');
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'cmd-settings-nav',
        title: 'Open System Settings',
        subtitle: 'Configure appearance, notifications, and security',
        category: 'System',
        icon: <Settings className="w-4 h-4 text-neutral-400" />,
        shortcut: '⌘,',
        action: () => {
          onNavigate?.('/settings');
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'cmd-ai-prompt',
        title: 'Ask Aura AI Assistant',
        subtitle: 'Trigger intelligent assistant modal',
        category: 'Actions',
        icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        shortcut: '⌘J',
        action: () => {
          console.log('[Aura] AI Assistant Triggered');
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'cmd-toggle-theme',
        title: 'Toggle Midnight / Dark Theme',
        subtitle: 'Switch global visual appearance mode',
        category: 'System',
        icon: <Moon className="w-4 h-4 text-cyan-400" />,
        action: () => {
          console.log('[Aura] Theme Toggle Triggered');
          setCommandPaletteOpen(false);
        },
      },
    ],
    [onNavigate, setCommandPaletteOpen]
  );

  // Global hotkey listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  // Execute global search whenever query or active commands change
  useEffect(() => {
    let isMounted = true;

    executeGlobalSearch(query, defaultCommands).then((searchResults) => {
      if (isMounted) {
        setResults(searchResults);
        setSelectedIndex(0);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [query, defaultCommands]);

  // Filter results by category if tab selected
  const filteredResults = useMemo(() => {
    if (activeCategory === 'All') return results;
    if (activeCategory === 'Pinned') {
      return results.filter((res) => pinnedCommandIds.includes(res.id));
    }
    return results.filter((res) => res.category === activeCategory);
  }, [results, activeCategory, pinnedCommandIds]);

  // Handle arrow navigation
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        if (query.trim()) {
          addRecentSearch(query.trim());
        }
        filteredResults[selectedIndex].action();
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  const categories = ['All', 'Pinned', 'Navigation', 'Actions', 'System', 'SDK Modules'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/70 backdrop-blur-md transition-opacity duration-200"
      onClick={() => setCommandPaletteOpen(false)}
      id="command-palette-backdrop"
    >
      <div
        className="w-full max-w-2xl mx-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-neutral-200"
        onClick={(e) => e.stopPropagation()}
        id="command-palette-container"
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-800 bg-neutral-950/40">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-base text-neutral-100 placeholder-neutral-500 focus:outline-none"
            placeholder="Type a command or search modules... (⌘K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            id="command-palette-input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-500 hover:text-neutral-300 rounded-lg hover:bg-neutral-800 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-medium text-neutral-400 bg-neutral-800/80 border border-neutral-700/60 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Category Tabs & Recent Chips */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800/60 bg-neutral-900/80 overflow-x-auto no-scrollbar text-xs">
          <div className="flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {recentSearches.length > 0 && query === '' && (
            <button
              onClick={() => clearRecentSearches()}
              className="text-neutral-500 hover:text-neutral-300 text-xs flex items-center gap-1 shrink-0 ml-2"
              title="Clear search history"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* Recent Search Queries list if query is empty */}
        {query === '' && recentSearches.length > 0 && activeCategory === 'All' && (
          <div className="px-4 py-2.5 border-b border-neutral-800/40 bg-neutral-950/20">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Recent Searches
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((s) => (
                <span
                  key={s.id}
                  onClick={() => setQuery(s.query)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-neutral-800/70 border border-neutral-700/40 text-neutral-300 hover:bg-neutral-700/60 cursor-pointer transition-colors"
                >
                  {s.query}
                  <X
                    className="w-3 h-3 text-neutral-500 hover:text-neutral-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(s.id);
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[50vh]">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-neutral-600 opacity-60" />
              <p className="text-sm">No commands or module results found for &quot;{query}&quot;.</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isPinned = pinnedCommandIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    if (query.trim()) addRecentSearch(query.trim());
                    item.action();
                  }}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-neutral-100'
                      : 'hover:bg-neutral-800/40 text-neutral-300 border border-transparent'
                  }`}
                  id={`command-item-${item.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {item.icon || <Command className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium leading-snug flex items-center gap-2 truncate">
                        <span>{item.title}</span>
                        {item.category && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-400 border border-neutral-700/50">
                            {item.category}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-neutral-500 truncate mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinCommand(item.id);
                      }}
                      className={`p-1.5 rounded-md transition-colors ${
                        isPinned
                          ? 'text-amber-400 bg-amber-950/40 border border-amber-800/50'
                          : 'text-neutral-600 hover:text-neutral-300 opacity-0 group-hover:opacity-100'
                      }`}
                      title={isPinned ? 'Unpin action' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-neutral-600 opacity-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <span>Aura Global Search Engine</span>
        </div>
      </div>
    </div>
  );
};
