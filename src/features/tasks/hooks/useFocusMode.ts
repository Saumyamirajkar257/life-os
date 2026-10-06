/**
 * @file useFocusMode.ts
 * @description Hook managing Pomodoro timer countdown loops, focus sessions, and active task tracking.
 * @module Features/Tasks/Hooks/UseFocusMode
 */

import { useEffect } from 'react';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useProductivity } from '../../productivity/hooks/useProductivity';

export function useFocusMode() {
  const uiStore = useTaskUIStore();
  const { notify } = useProductivity();

  useEffect(() => {
    let timer: any = null;

    if (uiStore.isPomodoroActive) {
      timer = setInterval(() => {
        uiStore.setPomodoroTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            uiStore.setPomodoroActive(false);

            if (uiStore.pomodoroMode === 'work') {
              uiStore.incrementPomodoroSessions();
              notify(
                'Focus Session Complete! 🎉',
                'Great focus! Take a well-deserved short break.',
                'success',
                'Focus'
              );
              uiStore.setPomodoroMode('shortBreak');
            } else {
              notify('Break Finished! ⚡', 'Ready for the next focus loop?', 'info', 'Focus');
              uiStore.setPomodoroMode('work');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [uiStore.isPomodoroActive, uiStore.pomodoroMode]);

  const toggleTimer = () => {
    uiStore.setPomodoroActive(!uiStore.isPomodoroActive);
  };

  const resetTimer = () => {
    uiStore.setPomodoroActive(false);
    uiStore.setPomodoroMode(uiStore.pomodoroMode);
  };

  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isPomodoroActive: uiStore.isPomodoroActive,
    timeLeft: uiStore.pomodoroTimeLeft,
    formattedTime: formatTimerDisplay(uiStore.pomodoroTimeLeft),
    mode: uiStore.pomodoroMode,
    sessionsCompleted: uiStore.pomodoroSessionsCompleted,
    focusedTaskId: uiStore.focusedTaskId,
    toggleTimer,
    resetTimer,
    setMode: uiStore.setPomodoroMode,
  };
}
