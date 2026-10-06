/**
 * @file useTaskKeyboardShortcuts.ts
 * @description Linear/Superhuman-style keyboard navigation and triage engine for Tasks Module.
 * Enables j/k navigation, x/Space completion, 1-4 priority triage, and f for focus mode.
 * @module Features/Tasks/Hooks/UseTaskKeyboardShortcuts
 */

import { useEffect, useCallback } from 'react';
import { TaskItem, TaskPriority } from '../types/task.types';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useTaskMutations } from '../hooks/useTaskMutations';

export function useTaskKeyboardShortcuts(tasks: TaskItem[]) {
  const {
    activeDetailTaskId,
    openDetailDrawer,
    closeDetailDrawer,
    openFormModal,
    openFocusModal,
    focusedTaskId,
    setFocusedTask,
    isFormModalOpen,
    isFocusModalOpen,
  } = useTaskUIStore();

  const { completeTask, undoComplete, updateTask, archiveTask, deleteTask } = useTaskMutations();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ignore if any modal is currently open
      if (isFormModalOpen || isFocusModalOpen) {
        if (e.key === 'Escape') {
          // Handled by modal escape listeners
        }
        return;
      }

      if (tasks.length === 0) return;

      const currentIdx = tasks.findIndex((t) => t.id === focusedTaskId);

      switch (e.key.toLowerCase()) {
        // Move selection down
        case 'j':
        case 'arrowdown': {
          e.preventDefault();
          const nextIdx = currentIdx < tasks.length - 1 ? currentIdx + 1 : 0;
          setFocusedTask(tasks[nextIdx].id);
          break;
        }

        // Move selection up
        case 'k':
        case 'arrowup': {
          e.preventDefault();
          const prevIdx = currentIdx > 0 ? currentIdx - 1 : tasks.length - 1;
          setFocusedTask(tasks[prevIdx].id);
          break;
        }

        // Toggle task completion (Space or X)
        case ' ':
        case 'x': {
          if (focusedTaskId) {
            e.preventDefault();
            const activeTask = tasks.find((t) => t.id === focusedTaskId);
            if (activeTask) {
              if (activeTask.status === 'done') {
                undoComplete(activeTask.id, activeTask.title);
              } else {
                completeTask(activeTask.id, activeTask.title);
              }
            }
          }
          break;
        }

        // Open details inspection drawer (Enter)
        case 'enter': {
          if (focusedTaskId) {
            e.preventDefault();
            openDetailDrawer(focusedTaskId);
          }
          break;
        }

        // Quick create new task (C or N)
        case 'c':
        case 'n': {
          e.preventDefault();
          openFormModal();
          break;
        }

        // Enter Deep Focus Mode on focused task (F)
        case 'f': {
          if (focusedTaskId) {
            e.preventDefault();
            openFocusModal(focusedTaskId);
          } else if (tasks.length > 0) {
            e.preventDefault();
            openFocusModal(tasks[0].id);
          }
          break;
        }

        // Priority shortcuts: 1 (Urgent), 2 (High), 3 (Medium), 4 (Low)
        case '1': {
          if (focusedTaskId) {
            e.preventDefault();
            updateTask(focusedTaskId, { priority: 'urgent' });
          }
          break;
        }
        case '2': {
          if (focusedTaskId) {
            e.preventDefault();
            updateTask(focusedTaskId, { priority: 'high' });
          }
          break;
        }
        case '3': {
          if (focusedTaskId) {
            e.preventDefault();
            updateTask(focusedTaskId, { priority: 'medium' });
          }
          break;
        }
        case '4': {
          if (focusedTaskId) {
            e.preventDefault();
            updateTask(focusedTaskId, { priority: 'low' });
          }
          break;
        }

        // Archive focused task (E)
        case 'e': {
          if (focusedTaskId) {
            e.preventDefault();
            const activeTask = tasks.find((t) => t.id === focusedTaskId);
            if (activeTask) archiveTask(activeTask.id);
          }
          break;
        }

        // Escape: deselect or close drawer
        case 'escape': {
          if (activeDetailTaskId) {
            closeDetailDrawer();
          } else if (focusedTaskId) {
            setFocusedTask(null);
          }
          break;
        }

        default:
          break;
      }
    },
    [
      tasks,
      focusedTaskId,
      activeDetailTaskId,
      isFormModalOpen,
      isFocusModalOpen,
      openDetailDrawer,
      closeDetailDrawer,
      openFormModal,
      openFocusModal,
      setFocusedTask,
      completeTask,
      undoComplete,
      updateTask,
      archiveTask,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
