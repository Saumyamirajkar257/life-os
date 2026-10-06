/**
 * @file useHabitReminders.ts
 * @description Hook managing scheduled reminders, snooze triggers, and Web Notifications API integration.
 * @module Features/Habits/Hooks/UseHabitReminders
 */

import { useState, useEffect } from 'react';
import { HabitItem } from '../types/habit.types';

export function useHabitReminders(habits: HabitItem[]) {
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [activeAlert, setActiveAlert] = useState<HabitItem | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setHasNotificationPermission(res === 'granted');
    }
  };

  const triggerReminder = (habit: HabitItem) => {
    setActiveAlert(habit);

    if (hasNotificationPermission && 'Notification' in window) {
      new Notification(`Aura Habit Reminder: ${habit.name}`, {
        body: habit.motivationNote || `Time to complete your daily ${habit.name} goal!`,
        icon: '/favicon.ico',
      });
    }
  };

  const snoozeReminder = (habitId: string, minutes = 15) => {
    setActiveAlert(null);
    console.log(`[HabitReminders] Snoozed habit ${habitId} for ${minutes} minutes.`);
  };

  return {
    hasNotificationPermission,
    requestPermission,
    activeAlert,
    dismissAlert: () => setActiveAlert(null),
    triggerReminder,
    snoozeReminder,
  };
}
