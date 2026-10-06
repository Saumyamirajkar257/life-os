/**
 * @file useProductivity.ts
 * @description Master custom hook for Global Search, Command Palette, and Notification Center dispatching.
 * @module Features/Productivity/Hooks/UseProductivity
 */

import { useProductivityStore } from '../stores/useProductivityStore';
import { executeGlobalSearch } from '../services/searchEngine';
import { SystemNotification, NotificationType } from '../types';

export function useProductivity() {
  const store = useProductivityStore();

  const notify = (
    title: string,
    message: string,
    type: NotificationType = 'info',
    category: string = 'System',
    actionButtons?: SystemNotification['actionButtons']
  ) => {
    return store.addNotification({
      title,
      message,
      type,
      priority: 'normal',
      category,
      actionButtons,
    });
  };

  return {
    ...store,
    notify,
    executeSearch: executeGlobalSearch,
  };
}
