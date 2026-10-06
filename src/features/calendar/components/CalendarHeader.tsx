/**
 * @file CalendarHeader.tsx
 * @description Toolbar for switching calendar view modes, date navigation, search/filter, and event creation.
 * @module Features/Calendar/Components
 */

import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  BarChart2,
  Clock,
  Sparkles,
  Columns,
} from 'lucide-react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { CalendarViewMode } from '../types/calendar.types';
import { EVENT_CATEGORIES } from '../constants/calendarConstants';

const VIEW_MODES: { mode: CalendarViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'day', label: 'Day', icon: <Clock className="w-4 h-4" /> },
  { mode: 'week', label: 'Week', icon: <Columns className="w-4 h-4" /> },
  { mode: 'month', label: 'Month', icon: <LayoutGrid className="w-4 h-4" /> },
  { mode: 'timeline', label: 'Timeline', icon: <CalendarIcon className="w-4 h-4" /> },
  { mode: 'planner', label: 'Planner', icon: <Sparkles className="w-4 h-4" /> },
];

export const CalendarHeader: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    currentDate,
    navigateDate,
    filterState,
    setSearchQuery,
    toggleCategoryFilter,
    resetFilters,
    openCreateModal,
  } = useCalendarUIStore();

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const formatHeaderTitle = () => {
    try {
      const [y, m, d] = currentDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return currentDate;
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-2">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">CALENDAR</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Plan your time, not just your events.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigateDate('today')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-text-secondary)] transition-colors"
          >
            Today
          </button>
          
          <div className="flex items-center gap-1 bg-[var(--color-surface)] rounded-lg p-1 border border-[var(--color-border)]">
            <button
              onClick={() => navigateDate('prev')}
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base font-bold text-white hidden md:block">{formatHeaderTitle()}</h2>
          
          <div className="flex-1" />

          {/* Secondary Controls */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 transition-colors ${
              filterState.categories.length > 0
                ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/40 text-[var(--color-accent)]'
                : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-text-secondary)]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {filterState.categories.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[var(--color-accent)] text-white text-[10px] flex items-center justify-center">
                {filterState.categories.length}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      <h2 className="text-base font-bold text-white md:hidden block">{formatHeaderTitle()}</h2>

      {/* 2. View Switcher */}
      <div className="flex items-center">
        <div className="flex items-center p-1 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-x-auto scrollbar-none">
          {VIEW_MODES.map((item) => (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                viewMode === item.mode
                  ? 'bg-[var(--color-surface-elevated)] text-white shadow-sm border border-[var(--color-border)]/50'
                  : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)]/50 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Popup */}
      {isFilterOpen && (
        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                placeholder="Search schedule..."
                value={filterState.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
            <button onClick={resetFilters} className="text-xs text-[var(--color-accent)] font-bold hover:underline">
              Reset Filters
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {EVENT_CATEGORIES.map((cat) => {
              const isSelected = filterState.categories.includes(cat.name);
              return (
                <button
                  key={cat.name}
                  onClick={() => toggleCategoryFilter(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    isSelected
                      ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/50 text-[var(--color-accent)]'
                      : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
