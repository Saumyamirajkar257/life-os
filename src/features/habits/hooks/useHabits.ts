/**
 * @file useHabits.ts
 * @description Master custom React hook for accessing filtered/sorted habits, analytics KPI summaries, and active view state.
 * @module Features/Habits/Hooks/UseHabits
 */

import { useEffect, useMemo } from 'react';
import { useHabitStore } from '../stores/useHabitStore';
import { useHabitUIStore } from '../stores/useHabitUIStore';
import { HabitItem, HabitAnalyticsSummary } from '../types/habit.types';
import { getTodayDateString, getDayOfWeekCode } from '../utils/habitDateUtils';
import { calculateConsistencyScore, calculateHabitStreaks, calculateUserHabitLevelAndXP } from '../utils/habitAnalyticsEngine';

export function useHabits() {
  const store = useHabitStore();
  const uiStore = useHabitUIStore();

  useEffect(() => {
    store.initializeHabits();
  }, []);

  const todayStr = getTodayDateString();
  const todayDayCode = getDayOfWeekCode(todayStr);

  // Compute logs map for quick lookup: habitId_date -> log
  const logMap = useMemo(() => {
    const map = new Map();
    store.logs.forEach((l) => map.set(`${l.habitId}_${l.date}`, l));
    return map;
  }, [store.logs]);

  // Filter habits according to view, search, category, tag
  const filteredHabits = useMemo(() => {
    return store.habits.filter((h) => {
      // Status filter
      if (uiStore.activeView === 'archived') {
        if (h.status !== 'archived') return false;
      } else {
        if (h.status === 'archived') return false;
      }

      // Time of Day views
      if (uiStore.activeView === 'morning' && h.timeOfDay !== 'morning') return false;
      if (uiStore.activeView === 'afternoon' && h.timeOfDay !== 'afternoon') return false;
      if (uiStore.activeView === 'evening' && h.timeOfDay !== 'evening') return false;

      // Completed / Missed views for today
      const todayLog = logMap.get(`${h.id}_${todayStr}`);
      const isCompletedToday = todayLog && todayLog.status === 'completed';

      if (uiStore.activeView === 'completed' && !isCompletedToday) return false;
      if (uiStore.activeView === 'missed' && isCompletedToday) return false;

      // Today view - frequency day check
      if (uiStore.activeView === 'today') {
        if (h.frequency === 'specific_days' && h.frequencyDays && h.frequencyDays.length > 0) {
          if (!h.frequencyDays.includes(todayDayCode)) return false;
        }
      }

      // Search Query
      if (uiStore.searchQuery.trim()) {
        const q = uiStore.searchQuery.toLowerCase();
        const matchName = h.name.toLowerCase().includes(q);
        const matchCat = h.category.toLowerCase().includes(q);
        const matchTag = h.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchTag) return false;
      }

      // Category filter
      if (uiStore.selectedCategory !== 'all') {
        if (h.category.toLowerCase() !== uiStore.selectedCategory.toLowerCase()) return false;
      }

      // Tag filter
      if (uiStore.selectedTag) {
        if (!h.tags.includes(uiStore.selectedTag)) return false;
      }

      return true;
    });
  }, [store.habits, uiStore.activeView, uiStore.searchQuery, uiStore.selectedCategory, uiStore.selectedTag, logMap, todayStr, todayDayCode]);

  // Sort habits
  const sortedHabits = useMemo(() => {
    return [...filteredHabits].sort((a, b) => {
      if (uiStore.selectedSort === 'streak') {
        return b.currentStreak - a.currentStreak;
      }
      if (uiStore.selectedSort === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (uiStore.selectedSort === 'category') {
        return a.category.localeCompare(b.category);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredHabits, uiStore.selectedSort]);

  // Top KPI metrics summary
  const stats: HabitAnalyticsSummary = useMemo(() => {
    const activeHabits = store.habits.filter((h) => h.status === 'active');
    const totalActive = activeHabits.length;

    let completedTodayCount = 0;
    activeHabits.forEach((h) => {
      const log = logMap.get(`${h.id}_${todayStr}`);
      if (log && log.status === 'completed') {
        completedTodayCount++;
      }
    });

    const todayCompletionRate = totalActive > 0 ? Math.round((completedTodayCount / totalActive) * 100) : 0;
    const consistencyScore = calculateConsistencyScore(store.habits, store.logs);

    const maxStreak = activeHabits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
    const totalCheckInsLifetime = store.logs.filter((l) => l.status === 'completed').length;

    const levelXP = calculateUserHabitLevelAndXP(store.habits, store.logs);

    return {
      totalActive,
      completedTodayCount,
      todayCompletionRate,
      overallSuccessRate: consistencyScore,
      consistencyScore,
      overallHabitScore: consistencyScore,
      longestActiveStreak: maxStreak,
      totalCheckInsLifetime,
      currentLevel: levelXP.level,
      currentXP: levelXP.currentXP,
      nextLevelXP: levelXP.nextLevelXP,
    };
  }, [store.habits, store.logs, logMap, todayStr]);

  const activeDetailHabit = useMemo(() => {
    if (!uiStore.activeDetailHabitId) return null;
    return store.habits.find((h) => h.id === uiStore.activeDetailHabitId) || null;
  }, [store.habits, uiStore.activeDetailHabitId]);

  return {
    ...store,
    allHabits: store.habits,
    displayedHabits: sortedHabits,
    stats,
    activeDetailHabit,
    logMap,
  };
}
