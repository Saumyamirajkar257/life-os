/**
 * @file usePlanner.ts
 * @description Hook unifying Tasks, Habits, Goals/Milestones, and Events into a single Daily Planner stream.
 * @module Features/Calendar/Hooks
 */

import { useMemo } from 'react';
import { useCalendarStore } from '../stores/useCalendarStore';
import { useTaskStore } from '@/features/tasks/stores/useTaskStore';
import { useHabitStore } from '@/features/habits/stores/useHabitStore';
import { useGoalStore } from '@/features/goals/stores/useGoalStore';
import { UnifiedPlannerItem } from '../types/calendar.types';

export function usePlanner(targetDateStr: string) {
  const events = useCalendarStore((state) => state.events);
  const tasks = useTaskStore((state) => state.tasks);
  const habits = useHabitStore((state) => state.habits);
  const milestones = useGoalStore((state) => state.milestones);

  const unifiedItems = useMemo(() => {
    const items: UnifiedPlannerItem[] = [];

    // 1. Calendar Events for targetDateStr
    const dayEvents = events.filter(
      (e) => e.status !== 'archived' && e.startDate <= targetDateStr && e.endDate >= targetDateStr
    );

    dayEvents.forEach((evt) => {
      items.push({
        id: evt.id,
        type: 'event',
        title: evt.title,
        category: evt.category,
        timeOrStatusStr: evt.isAllDay ? 'All Day' : `${evt.startTime} - ${evt.endTime}`,
        dateStr: evt.startDate,
        isCompleted: evt.status === 'completed',
        color: evt.color || '#3B82F6',
        icon: evt.icon || 'Calendar',
        rawItem: evt,
      });
    });

    // 2. Tasks due on or before targetDateStr
    const dayTasks = tasks.filter(
      (t) => t.status !== 'archived' && (t.dueDate === targetDateStr || (!t.dueDate && (t.status as string) !== 'done'))
    );

    dayTasks.forEach((task) => {
      items.push({
        id: task.id,
        type: 'task',
        title: task.title,
        category: task.category,
        timeOrStatusStr: task.dueTime ? `Due ${task.dueTime}` : 'Task',
        dateStr: task.dueDate || targetDateStr,
        isCompleted: task.status === 'done',
        color: '#8B5CF6',
        icon: 'CheckSquare',
        rawItem: task,
      });
    });

    // 3. Habits scheduled for targetDateStr
    habits.forEach((habit) => {
      if (habit.status === 'active') {
        items.push({
          id: habit.id,
          type: 'habit',
          title: habit.name,
          category: habit.category,
          timeOrStatusStr: habit.timeOfDay || 'Daily Habit',
          dateStr: targetDateStr,
          isCompleted: habit.currentStreak > 0,
          color: habit.color || '#10B981',
          icon: habit.icon || 'Flame',
          rawItem: habit,
        });
      }
    });

    // 4. Milestones due on targetDateStr
    const dayMilestones = milestones.filter((m) => m.dueDate === targetDateStr);
    dayMilestones.forEach((m) => {
      items.push({
        id: m.id,
        type: 'milestone',
        title: m.title,
        category: 'Milestone',
        timeOrStatusStr: `Milestone (${m.progress}%)`,
        dateStr: m.dueDate,
        isCompleted: m.status === 'completed',
        color: '#F59E0B',
        icon: 'Flag',
        rawItem: m,
      });
    });

    return items;
  }, [events, tasks, habits, milestones, targetDateStr]);

  return {
    items: unifiedItems,
    eventCount: unifiedItems.filter((i) => i.type === 'event').length,
    taskCount: unifiedItems.filter((i) => i.type === 'task').length,
    habitCount: unifiedItems.filter((i) => i.type === 'habit').length,
    milestoneCount: unifiedItems.filter((i) => i.type === 'milestone').length,
  };
}
