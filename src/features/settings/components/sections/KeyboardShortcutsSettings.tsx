/**
 * @file KeyboardShortcutsSettings.tsx
 * @description View and customize keyboard shortcut bindings with key press recording and reset controls.
 * @module Features/Settings/Components/Sections/KeyboardShortcutsSettings
 */

import React, { useState } from 'react';
import { Command, Search, RotateCcw, Edit2, Check, X, Keyboard } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const KeyboardShortcutsSettings: React.FC = () => {
  const { shortcuts, updateShortcuts, updateShortcutKey, resetShortcutsToDefault, playToggleSound } =
    useSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempKey, setTempKey] = useState('');

  const filteredShortcuts = shortcuts.shortcuts.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.currentKey.toLowerCase().includes(q)
    );
  });

  const categories = ['General', 'Navigation', 'Workspaces', 'System'];

  const handleStartEdit = (id: string, currentKey: string) => {
    setEditingId(id);
    setTempKey(currentKey);
  };

  const handleSaveEdit = (id: string) => {
    if (tempKey.trim()) {
      updateShortcutKey(id, tempKey.trim());
      playToggleSound();
    }
    setEditingId(null);
    setTempKey('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Command className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Keyboard Shortcuts & Hotkeys</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Global keybindings for rapid shell navigation and workspace control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Master Toggle */}
          <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-lg">
            <span className="text-xs font-mono text-[var(--color-text-secondary)]">Shortcuts:</span>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateShortcuts({ enabled: !shortcuts.enabled });
              }}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                shortcuts.enabled ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  shortcuts.enabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              playToggleSound();
              resetShortcutsToDefault();
            }}
            className="gap-1.5 text-xs font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <Input
          placeholder="Filter shortcuts by action, key, or category..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-[var(--color-text-muted)]" />}
        />
      </div>

      {/* Category Groupings */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const groupShortcuts = filteredShortcuts.filter((s) => s.category === cat);
          if (groupShortcuts.length === 0) return null;

          return (
            <div key={cat} className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)] pb-1">
                {cat} Shortcuts
              </h4>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl divide-y divide-[var(--color-border)] overflow-hidden">
                {groupShortcuts.map((s) => {
                  const isEditing = editingId === s.id;

                  return (
                    <div
                      key={s.id}
                      className="p-3.5 flex items-center justify-between gap-4 hover:bg-[var(--color-surface-elevated)]/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-[var(--color-text-primary)]">
                          {s.description}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--color-text-muted)]">
                          ID: {s.id} {s.isCustom && '• Custom Modified'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={tempKey}
                              onChange={(e) => setTempKey(e.target.value)}
                              placeholder="e.g. ⌘K"
                              className="w-24 h-8 px-2 font-mono text-xs rounded bg-[var(--color-surface-elevated)] border border-[var(--color-accent)] text-[var(--color-text-primary)] focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(s.id)}
                              className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer"
                              title="Save keybinding"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded bg-[var(--color-surface-elevated)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-accent)] font-semibold shadow-xs">
                              {s.currentKey}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(s.id, s.currentKey)}
                              className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                              title="Edit keybinding"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
