/**
 * @file TaskFilterBar.tsx
 * @description Toolbar for quick search, view tab switching, filter chips, and primary task actions.
 * @module Features/Tasks/Components/TaskFilterBar
 */

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Play,
  X,
  ChevronDown
} from 'lucide-react';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { TASK_VIEW_TABS } from '../constants/taskConstants';

export const TaskFilterBar: React.FC = () => {
  const {
    filters,
    activeView,
    viewCounts,
    setSearchQuery,
    setFilters,
    resetFilters,
    setActiveView,
  } = useTaskFilters();

  const {
    openFormModal,
    openFocusModal,
  } = useTaskUIStore();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const activeFilterCount = [
    filters.isPinnedOnly,
    filters.isFavouriteOnly,
    filters.hasSubtasksOnly,
    (filters.priority && filters.priority.length > 0),
    (filters.status && filters.status.length > 0)
  ].filter(Boolean).length;

  const primaryViews = TASK_VIEW_TABS.filter(t => ['today', 'upcoming', 'inbox', 'completed'].includes(t.id));
  const advancedViews = TASK_VIEW_TABS.filter(t => ['list', 'kanban', 'matrix', 'calendar', 'timeline', 'archived', 'overdue'].includes(t.id));
  const activeViewLabel = TASK_VIEW_TABS.find(t => t.id === activeView)?.label || 'View';

  return (
    <div className="space-y-4 mb-6" id="task-filter-bar-container">
      {/* Top Main Toolbar Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: View Tabs & Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {/* Primary View Tabs */}
          <div className="flex items-center p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
            {primaryViews.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeView === tab.id
                    ? 'bg-[var(--color-surface-elevated)] text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-transparent border border-[var(--color-border)] rounded-lg text-sm text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          
          <div className="flex items-center gap-2">
            {/* Advanced Views Dropdown (Simplified) */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors flex items-center gap-1.5">
                {advancedViews.find(v => v.id === activeView) ? activeViewLabel : 'View'} <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
                {advancedViews.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`w-full text-left px-4 py-2 text-sm ${activeView === tab.id ? 'text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)]'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeFilterCount > 0 
                  ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' 
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-[var(--color-accent)] text-white text-[10px] flex items-center justify-center font-bold">{activeFilterCount}</span>}
            </button>

            {/* Focus Mode */}
            <button
              type="button"
              onClick={() => openFocusModal()}
              className="px-3 py-2 rounded-lg border border-purple-500/30 text-purple-400 text-sm font-medium flex items-center gap-1.5 transition-colors hover:bg-purple-500/10"
            >
              <Play className="w-4 h-4" /> Focus
            </button>
          </div>

          {/* New Task Button */}
          <button
            type="button"
            onClick={() => openFormModal()}
            className="px-4 py-2 rounded-lg bg-[var(--color-accent)] hover:opacity-90 text-white text-sm font-medium flex items-center gap-1.5 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="p-3 bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters({ isPinnedOnly: !filters.isPinnedOnly })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                filters.isPinnedOnly ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-white'
              }`}
            >
              📌 Pinned
            </button>
            <button
              onClick={() => setFilters({ isFavouriteOnly: !filters.isFavouriteOnly })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                filters.isFavouriteOnly ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-white'
              }`}
            >
              ⭐ Favourites
            </button>
            <button
              onClick={() => setFilters({ hasSubtasksOnly: !filters.hasSubtasksOnly })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                filters.hasSubtasksOnly ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-white'
              }`}
            >
              ☑ Subtasks
            </button>
          </div>
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
};
