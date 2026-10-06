/**
 * @file AIMemoryManager.tsx
 * @description Structured Memory Engine manager for inspecting, adding, editing, and deleting AI memories.
 * @module AuraAI/Components
 */

import React, { useState } from 'react';
import { Database, Plus, Search, Trash2, Tag, Key, Shield, Sparkles } from 'lucide-react';
import { useAIMemory } from '../hooks/useAIMemory';
import { MemoryCategory, MemoryImportance } from '../types';

export const AIMemoryManager: React.FC = () => {
  const { memories, searchQuery, selectedCategory, setSearchQuery, setSelectedCategory, addMemory, deleteMemory, totalCount } =
    useAIMemory();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('user_preference');
  const [newImportance, setNewImportance] = useState<MemoryImportance>('medium');

  const handleAdd = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    addMemory(newCategory, newKey, newValue, newImportance);
    setNewKey('');
    setNewValue('');
    setShowAddModal(false);
  };

  const categories: { label: string; value: MemoryCategory | 'all' }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'User Preferences', value: 'user_preference' },
    { label: 'Working Hours', value: 'working_hours' },
    { label: 'Workout Routine', value: 'workout_routine' },
    { label: 'Sleep Schedule', value: 'sleep_schedule' },
    { label: 'Long Term', value: 'long_term_preference' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
            <Database className="w-4 h-4" /> AI Memory Engine
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Structured Memory & Recall</h2>
          <p className="text-xs text-slate-400">
            Aura Intelligence retains long-term structured facts, schedules, and routines to personalize daily syntheses.
          </p>
        </div>

        <button
          id="add-memory-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto shadow-lg shadow-emerald-950/40"
        >
          <Plus className="w-4 h-4" /> Add Memory Fact
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="search-memory-input"
            type="text"
            placeholder="Search remembered facts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[var(--color-accent-muted)]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.value}
              id={`filter-cat-${c.value}`}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.value
                  ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent-light)] border border-[var(--color-accent)]/30'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-white border border-[var(--color-border)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memories.map((m) => {
          const importanceColor =
            m.importance === 'critical'
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              : m.importance === 'high'
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              : 'text-[var(--color-text-secondary)] bg-[var(--color-background)] border-[var(--color-border)]';

          return (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-emerald-400" /> {m.category.replace('_', ' ')}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${importanceColor} uppercase font-semibold`}>
                  {m.importance}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" /> {m.key}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
                  {m.value}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--color-text-tertiary)] pt-2 border-t border-[var(--color-border)]">
                <span>Source: {m.source}</span>
                <button
                  id={`delete-mem-btn-${m.id}`}
                  onClick={() => deleteMemory(m.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete memory item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Add New Memory Fact
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Fact Title / Key</label>
                <input
                  type="text"
                  placeholder="e.g. Study Focus Hours"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-slate-200 focus:outline-none focus:border-[var(--color-accent-muted)]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Fact Value / Detail</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prefers deep work sessions on Monday/Wednesday afternoons"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-slate-200 focus:outline-none focus:border-[var(--color-accent-muted)] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                    className="w-full p-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-slate-200 focus:outline-none focus:border-[var(--color-accent-muted)]"
                  >
                    <option value="user_preference">User Preference</option>
                    <option value="working_hours">Working Hours</option>
                    <option value="workout_routine">Workout Routine</option>
                    <option value="sleep_schedule">Sleep Schedule</option>
                    <option value="long_term_preference">Long Term</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Importance</label>
                  <select
                    value={newImportance}
                    onChange={(e) => setNewImportance(e.target.value as MemoryImportance)}
                    className="w-full p-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-slate-200 focus:outline-none focus:border-[var(--color-accent-muted)]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-background)] hover:bg-[var(--color-surface-hover)] text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
              >
                Save Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
