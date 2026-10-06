/**
 * @file useTaskMutations.ts
 * @description Hook providing task mutation operations coupled with global toast feedback notifications.
 * @module Features/Tasks/Hooks/UseTaskMutations
 */

import { useTaskStore } from '../stores/useTaskStore';
import { useTaskUIStore } from '../stores/useTaskUIStore';
import { useProductivity } from '../../productivity/hooks/useProductivity';
import { TaskItem, TaskPriority, TaskStatus } from '../types/task.types';

export function useTaskMutations() {
  const store = useTaskStore();
  const uiStore = useTaskUIStore();
  const { notify } = useProductivity();

  const handleCreateTask = (data: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const created = store.createTask(data);
    notify('Task Created', `"${created.title}" added to ${created.category}`, 'success', 'Tasks');
    uiStore.closeFormModal();
    return created;
  };

  const handleUpdateTask = (id: string, updates: Partial<TaskItem>) => {
    store.updateTask(id, updates);
    notify('Task Updated', 'Changes saved successfully', 'info', 'Tasks');
  };

  const handleDeleteTask = (id: string, title?: string) => {
    store.deleteTask(id);
    notify('Task Deleted', title ? `"${title}" was removed` : 'Task removed', 'warning', 'Tasks');
    if (uiStore.activeDetailTaskId === id) uiStore.closeDetailDrawer();
  };

  const handleCompleteTask = (id: string, title: string) => {
    store.completeTask(id);
    notify(
      'Task Completed',
      `Great job completing "${title}"!`,
      'success',
      'Tasks',
      [
        {
          label: 'Undo',
          action: () => {
            store.undoCompleteTask(id);
            notify('Task Restored', `"${title}" moved back to To Do`, 'info', 'Tasks');
          },
        },
      ]
    );
  };

  const handleUndoComplete = (id: string, title: string) => {
    store.undoCompleteTask(id);
    notify('Task Reopened', `"${title}" moved back to active list`, 'info', 'Tasks');
  };

  const handleDuplicateTask = (id: string) => {
    const duplicated = store.duplicateTask(id);
    if (duplicated) {
      notify('Task Duplicated', `Created copy of "${duplicated.title}"`, 'success', 'Tasks');
    }
  };

  const handleArchiveTask = (id: string) => {
    store.archiveTask(id);
    notify('Task Archived', 'Task moved to archive', 'info', 'Tasks');
    if (uiStore.activeDetailTaskId === id) uiStore.closeDetailDrawer();
  };

  const handleRestoreTask = (id: string) => {
    store.restoreTask(id);
    notify('Task Restored', 'Task moved back to active list', 'success', 'Tasks');
  };

  const handleBulkDelete = () => {
    const count = uiStore.selectedTaskIds.length;
    if (count === 0) return;

    store.bulkDelete(uiStore.selectedTaskIds);
    notify('Bulk Delete', `Deleted ${count} tasks`, 'warning', 'Tasks');
    uiStore.clearSelection();
  };

  const handleBulkStatusChange = (status: TaskStatus) => {
    const count = uiStore.selectedTaskIds.length;
    if (count === 0) return;

    store.bulkUpdateStatus(uiStore.selectedTaskIds, status);
    notify('Bulk Update', `Moved ${count} tasks to ${status}`, 'success', 'Tasks');
    uiStore.clearSelection();
  };

  const handleBulkPriorityChange = (priority: TaskPriority) => {
    const count = uiStore.selectedTaskIds.length;
    if (count === 0) return;

    store.bulkUpdatePriority(uiStore.selectedTaskIds, priority);
    notify('Bulk Priority', `Updated priority for ${count} tasks`, 'info', 'Tasks');
    uiStore.clearSelection();
  };

  return {
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    completeTask: handleCompleteTask,
    undoComplete: handleUndoComplete,
    duplicateTask: handleDuplicateTask,
    archiveTask: handleArchiveTask,
    restoreTask: handleRestoreTask,
    bulkDelete: handleBulkDelete,
    bulkStatusChange: handleBulkStatusChange,
    bulkPriorityChange: handleBulkPriorityChange,
  };
}
