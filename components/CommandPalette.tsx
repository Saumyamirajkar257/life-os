'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  BookOpen,
  BarChart3,
  Wallet,
  BrainCircuit,
  Sparkles,
  Settings,
  Plus,
  Zap,
  PenLine,
  Search,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useBrainStore } from '@/store/useBrainStore';
import { useVaultStore } from '@/store/useVaultStore';
import { modalOverlay, modalContent } from '@/animations';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface CommandItemDef {
  id: string;
  icon: LucideIcon;
  label: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

function useCommandItems(): CommandItemDef[] {
  const router = useRouter();
  const { setActivePage, setCommandPaletteOpen } = useAppStore();

  const close = useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen]);

  return useMemo(() => {
    const navigate = (page: string, href: string) => {
      setActivePage(page);
      router.push(href);
      close();
    };

    return [
      // Navigation
      { id: 'nav-dashboard', icon: LayoutDashboard, label: 'Go to Dashboard', category: 'Navigation', shortcut: '⌘1', action: () => navigate('dashboard', '/') },
      { id: 'nav-tasks', icon: CheckSquare, label: 'Go to Tasks', category: 'Navigation', shortcut: '⌘2', action: () => navigate('tasks', '/tasks') },
      { id: 'nav-habits', icon: Target, label: 'Go to Habits', category: 'Navigation', shortcut: '⌘3', action: () => navigate('habits', '/habits') },
      { id: 'nav-journal', icon: BookOpen, label: 'Go to Journal', category: 'Navigation', shortcut: '⌘4', action: () => navigate('journal', '/journal') },
      { id: 'nav-analytics', icon: BarChart3, label: 'Go to Analytics', category: 'Navigation', shortcut: '⌘5', action: () => navigate('analytics', '/analytics') },
      { id: 'nav-finance', icon: Wallet, label: 'Go to Finance', category: 'Navigation', action: () => navigate('finance', '/finance') },
      { id: 'nav-focus', icon: BrainCircuit, label: 'Go to Focus', category: 'Navigation', action: () => navigate('focus', '/focus') },
      { id: 'nav-ai', icon: Sparkles, label: 'Go to AI Insights', category: 'Navigation', action: () => navigate('ai insights', '/ai') },
      { id: 'nav-settings', icon: Settings, label: 'Go to Settings', category: 'Navigation', action: () => navigate('settings', '/settings') },

      // Actions
      { id: 'act-create-task', icon: Plus, label: 'Create New Task', category: 'Actions', shortcut: '⌘N', action: () => { navigate('tasks', '/tasks'); } },
      { id: 'act-focus-mode', icon: Zap, label: 'Enter Focus Mode', category: 'Actions', shortcut: '⌘F', action: () => { navigate('focus', '/focus'); } },
      { id: 'act-journal-entry', icon: PenLine, label: 'Add Journal Entry', category: 'Actions', action: () => { navigate('journal', '/journal'); } },
      { id: 'act-open-analytics', icon: BarChart3, label: 'Open Analytics', category: 'Actions', action: () => { navigate('analytics', '/analytics'); } },

      // Quick Create
      { id: 'qc-task', icon: CheckSquare, label: 'New Task', category: 'Quick Create', action: () => { navigate('tasks', '/tasks'); } },
      { id: 'qc-habit', icon: Target, label: 'New Habit', category: 'Quick Create', action: () => { navigate('habits', '/habits'); } },
      { id: 'qc-journal', icon: BookOpen, label: 'New Journal Entry', category: 'Quick Create', action: () => { navigate('journal', '/journal'); } },
    ];
  }, [router, setActivePage, close]);
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx === -1) return <span>{text}</span>;

  return (
    <span>
      {text.slice(0, idx)}
      <span className="font-bold text-white">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </span>
  );
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setActivePage } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allCommands = useCommandItems();
  const router = useRouter();

  // Import stores for indexing
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { nodes } = useBrainStore();
  const { resources } = useVaultStore();

  // Filter commands based on query and index stores
  const filteredCommands = useMemo(() => {
    let results = [...allCommands];

    if (query.trim()) {
      const lowerQ = query.toLowerCase();
      results = allCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(lowerQ) ||
          cmd.category.toLowerCase().includes(lowerQ)
      );

      // Append matching tasks
      const matchingTasks = tasks
        .filter(t => t.title.toLowerCase().includes(lowerQ) || t.description?.toLowerCase().includes(lowerQ))
        .map(t => ({
          id: `task-search-${t.id}`,
          icon: CheckSquare,
          label: `Task: ${t.title} (${t.completed ? 'Completed' : 'Pending'})`,
          category: 'Tasks Search' as const,
          action: () => {
            setActivePage('tasks');
            router.push('/tasks');
            setCommandPaletteOpen(false);
          }
        }));
      
      // Append matching habits
      const matchingHabits = habits
        .filter(h => h.title.toLowerCase().includes(lowerQ) || h.description?.toLowerCase().includes(lowerQ))
        .map(h => ({
          id: `habit-search-${h.id}`,
          icon: Target,
          label: `Habit: ${h.title} (Streak: ${h.currentStreak}d)`,
          category: 'Habits Search' as const,
          action: () => {
            setActivePage('habits');
            router.push('/habits');
            setCommandPaletteOpen(false);
          }
        }));

      // Append matching brain nodes
      const matchingNodes = nodes
        .filter(n => n.title.toLowerCase().includes(lowerQ) || n.content.toLowerCase().includes(lowerQ))
        .map(n => ({
          id: `node-search-${n.id}`,
          icon: BrainCircuit,
          label: `Brain Node: ${n.title} [${n.type}]`,
          category: 'Second Brain Search' as const,
          action: () => {
            setActivePage('brain');
            router.push('/brain');
            setCommandPaletteOpen(false);
          }
        }));

      // Append matching vault resources
      const matchingResources = resources
        .filter(r => r.title.toLowerCase().includes(lowerQ) || r.notes.toLowerCase().includes(lowerQ))
        .map(r => ({
          id: `vault-search-${r.id}`,
          icon: Sparkles,
          label: `Vault: ${r.title} [${r.category}]`,
          category: 'Resource Vault Search' as const,
          action: () => {
            setActivePage('study');
            router.push('/study');
            setCommandPaletteOpen(false);
          }
        }));

      results.push(...matchingTasks, ...matchingHabits, ...matchingNodes, ...matchingResources);
    }
    
    return results;
  }, [allCommands, query, tasks, habits, nodes, resources, router, setActivePage, setCommandPaletteOpen]);

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItemDef[]> = {};
    for (const cmd of filteredCommands) {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    }
    return groups;
  }, [filteredCommands]);

  // Flatten for keyboard nav
  const flatItems = useMemo(() => {
    const flat: CommandItemDef[] = [];
    for (const category of Object.keys(groupedCommands)) {
      flat.push(...groupedCommands[category]);
    }
    return flat;
  }, [groupedCommands]);

  // Keyboard shortcut to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Reset state on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Keep selected index in bounds
  useEffect(() => {
    if (selectedIndex >= flatItems.length) {
      setSelectedIndex(Math.max(0, flatItems.length - 1));
    }
  }, [flatItems.length, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          flatItems[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setCommandPaletteOpen(false);
        break;
    }
  };

  let flatIndex = 0;

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Overlay */}
          <motion.div
            variants={modalOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />

          {/* Modal */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-xl mx-4 glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Search className="w-5 h-5 text-white/30 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none"
              />
              <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/25">
                ESC
              </kbd>
            </div>

            {/* Command list */}
            <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2 scrollbar-none">
              {flatItems.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-white/25 text-sm">No results found</p>
                  <p className="text-white/15 text-xs mt-1">Try a different search term</p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-5 py-2">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">
                        {category}
                      </span>
                    </div>
                    {items.map((item) => {
                      const currentFlatIndex = flatIndex++;
                      const isSelected = currentFlatIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          data-selected={isSelected}
                          onClick={() => item.action()}
                          onMouseEnter={() => setSelectedIndex(currentFlatIndex)}
                          className={cn(
                            'w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors duration-100',
                            isSelected
                              ? 'bg-white/10 text-white'
                              : 'text-white/50 hover:bg-white/5'
                          )}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1 text-sm">
                            <HighlightedText text={item.label} query={query} />
                          </span>
                          {item.shortcut && (
                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/25">
                              {item.shortcut}
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-4 text-[10px] text-white/20">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 font-mono">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 font-mono">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 font-mono">esc</kbd>
                close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
