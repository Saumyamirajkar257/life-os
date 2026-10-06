/**
 * @file useTasks.ts
 * @description Primary custom hook aggregating tasks data, view filtering, sorting, grouping, and stats calculations.
 * @module Features/Tasks/Hooks/UseTasks
 */

import { useEffect, useMemo } from 'react';
import { useTaskStore } from '../stores/useTaskStore';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import {
  filterTasksByView,
  filterTasksByQueryAndState,
  sortTasks,
  groupTasks,
  computeTaskStats,
} from '../utils/taskSortFilter';

export function useTasks() {
  const store = useTaskStore();
  const uiStore = useTaskUIStore();

  // Initialize Firestore subscription on mount
  useEffect(() => {
    const unsubscribe = store.initializeStore();
    return () => unsubscribe();
  }, []);

  // Filter tasks by active view tab
  const viewTasks = useMemo(() => {
    return filterTasksByView(store.tasks, uiStore.activeView);
  }, [store.tasks, uiStore.activeView]);

  // Apply query and filter state
  const filteredTasks = useMemo(() => {
    return filterTasksByQueryAndState(viewTasks, uiStore.filters);
  }, [viewTasks, uiStore.filters]);

  // Apply sorting
  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks, uiStore.sortBy, uiStore.sortDirection);
  }, [filteredTasks, uiStore.sortBy, uiStore.sortDirection]);

  // Apply grouping
  const groupedTasks = useMemo(() => {
    return groupTasks(sortedTasks, uiStore.groupBy);
  }, [sortedTasks, uiStore.groupBy]);

  // Compute stats across all non-archived tasks
  const stats = useMemo(() => {
    return computeTaskStats(store.tasks);
  }, [store.tasks]);

  // Active detail task
  const activeDetailTask = useMemo(() => {
    return store.tasks.find((t) => t.id === uiStore.activeDetailTaskId) || null;
  }, [store.tasks, uiStore.activeDetailTaskId]);

  return {
    ...store,
    allTasks: store.tasks,
    displayedTasks: sortedTasks,
    groupedTasks,
    stats,
    activeDetailTask,
  };
}
