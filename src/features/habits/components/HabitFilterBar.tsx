/**
 * @file HabitFilterBar.tsx
 * @description View mode selector, search query, category dropdown, and new habit creation action bar.
 * @module Features/Habits/Components/HabitFilterBar
 */

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  X,
} from 'lucide-react';
import { useHabitUIStore, HabitSortOption } from '../stores/useHabitUIStore';
import { HabitActiveView, HabitCategory } from '../types/habit.types';
import { HABIT_CATEGORIES } from '../constants/habitConstants';

export const HabitFilterBar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSort,
    setSelectedSort,
    openFormModal,
  } = useHabitUIStore();

  const [showFilters, setShowFilters] = useState(false);

  const primaryViews: { id: HabitActiveView; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'all', label: 'All Habits' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const advancedViews: { id: HabitActiveView; label: string }[] = [
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'evening', label: 'Evening' },
    { id: 'completed', label: 'Completed' },
    { id: 'missed', label: 'Missed' },
    { id: 'archived', label: 'Archived' },
  ];

  const activeViewLabel = [...primaryViews, ...advancedViews].find(v => v.id === activeView)?.label || 'View';
  const hasActiveFilters = selectedCategory !== 'all' || selectedSort !== 'streak';

  return (
    <div className="space-y-4 mb-6" id="habit-filter-bar-container">
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
              placeholder="Search habits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-transparent border border-[var(--color-border)] rounded-lg text-sm text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            {searchQuery && (
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
            {/* Advanced Views Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors flex items-center gap-1.5">
                {advancedViews.find(v => v.id === activeView) ? activeViewLabel : 'More Views'} <ChevronDown className="w-3 h-3" />
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
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1.5 ${
                hasActiveFilters
                  ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' 
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* New Habit Button */}
          <button
            type="button"
            onClick={() => openFormModal()}
            className="px-4 py-2 rounded-lg bg-[var(--color-accent)] hover:opacity-90 text-white text-sm font-medium flex items-center gap-1.5 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Habit
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="p-3 bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-xl flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {HABIT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as HabitSortOption)}
            className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
          >
            <option value="streak">Sort by Streak</option>
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="created">Sort by Created Date</option>
          </select>
          
          {hasActiveFilters && (
            <button 
              onClick={() => { setSelectedCategory('all'); setSelectedSort('streak'); }} 
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 ml-auto"
            >
              <X className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
};
