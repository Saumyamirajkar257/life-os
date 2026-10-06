/**
 * @file useTaskFilters.ts
 * @description Custom hook for managing quick filters, search input, and badge counts per view tab.
 * @module Features/Tasks/Hooks/UseTaskFilters
 */

import { useMemo } from 'react';
import { useTaskStore } from '../stores/useTaskStore';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { TaskViewMode } from '../types/task.types';
import { filterTasksByView } from '../utils/taskSortFilter';

export function useTaskFilters() {
  const { tasks } = useTaskStore();
  const uiStore = useTaskUIStore();

  // Compute item counts for each view tab badge
  const viewCounts = useMemo(() => {
    const counts: Record<TaskViewMode, number> = {
      inbox: 0,
      today: 0,
      upcoming: 0,
      completed: 0,
      archived: 0,
      overdue: 0,
      calendar: 0,
      kanban: 0,
      timeline: 0,
      list: 0,
    };

    (
      [
        'inbox',
        'today',
        'upcoming',
        'completed',
        'archived',
        'overdue',
        'calendar',
        'kanban',
        'timeline',
        'list',
      ] as TaskViewMode[]
    ).forEach((view) => {
      counts[view] = filterTasksByView(tasks, view).length;
    });

    return counts;
  }, [tasks]);

  const activeCategoryList = useMemo(() => {
    const categories = new Set<string>();
    tasks.forEach((t) => {
      if (t.category) categories.add(t.category);
    });
    return Array.from(categories);
  }, [tasks]);

  const activeTagList = useMemo(() => {
    const tags = new Set<string>();
    tasks.forEach((t) => {
      t.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [tasks]);

  return {
    filters: uiStore.filters,
    activeView: uiStore.activeView,
    viewCounts,
    activeCategoryList,
    activeTagList,
    setSearchQuery: uiStore.setSearchQuery,
    setFilters: uiStore.setFilters,
    resetFilters: uiStore.resetFilters,
    setActiveView: uiStore.setActiveView,
  };
}
