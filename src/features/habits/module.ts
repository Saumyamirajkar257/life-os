/**
 * @file module.ts
 * @description Aura Module SDK registration for the Habits Module (Milestone 13).
 * @module Features/Habits/Module
 */

import { createModule } from '../../sdk/registration/registerModule';
import { HabitsPage } from './pages/HabitsPage';
import { useHabitStore } from './stores/useHabitStore';
import { useHabitUIStore } from './stores/useHabitUIStore';

export const HabitsModule = createModule(
  'habits',
  'Habits OS',
  'productivity',
  (builder) =>
    builder
      .setDescription('Atomic habit tracking system inspired by Habitify, Streaks, Loop Habit Tracker and Atomic Habits')
      .setVersion('1.0.0')
      .setIcon('Flame')
      .setTags(['habits', 'streaks', 'atomic', 'analytics', 'mindset', 'health'])
      .addSidebarItem({
        itemId: 'habits-sidebar-main',
        label: 'Habits',
        icon: 'Flame',
        path: '/habits',
        badge: 'Atomic',
        section: 'primary',
        order: 2,
      })
      .addRoute({
        path: '/habits',
        component: HabitsPage,
        protected: true,
        title: 'Habits — Aura Life OS',
      })
      .addCommand({
        commandId: 'habits-command-create',
        title: 'Create New Habit',
        category: 'Habits',
        action: () => {
          useHabitUIStore.getState().openFormModal();
        },
      })
      .addCommand({
        commandId: 'habits-command-analytics',
        title: 'View Habit Analytics & Heatmap',
        category: 'Habits',
        action: () => {
          useHabitUIStore.getState().setActiveView('analytics');
        },
      })
      .addCommand({
        commandId: 'habits-command-calendar',
        title: 'View Habit Streak Calendar',
        category: 'Habits',
        action: () => {
          useHabitUIStore.getState().setActiveView('calendar');
        },
      })
      .addSearchProvider({
        providerId: 'habits-search-provider',
        entityName: 'Habits Search',
        searchHandler: async (query: string) => {
          const q = query.toLowerCase().trim();
          if (!q) return [];

          const habits = useHabitStore.getState().habits;
          return habits
            .filter(
              (h) =>
                h.name.toLowerCase().includes(q) ||
                h.category.toLowerCase().includes(q) ||
                h.tags.some((tag) => tag.toLowerCase().includes(q))
            )
            .slice(0, 5)
            .map((h) => ({
              id: `search-habit-${h.id}`,
              title: `${h.emoji || '⚡'} ${h.name}`,
              subtitle: `${h.category} • ${h.currentStreak}d Streak`,
              category: 'Habits',
              icon: 'Flame',
              metadata: { habitId: h.id },
            }));
        },
        onSelect: (result) => {
          if (result.metadata?.habitId) {
            useHabitUIStore.getState().openDetailDrawer(result.metadata.habitId);
          }
        },
      })
);
