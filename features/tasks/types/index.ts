export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  project?: string;
  dueDate?: string;
  priority: TaskPriority;
  completed: boolean;
  tags: string[];
}

export type TaskView = 'all' | 'today' | 'upcoming';
export type TaskStatusFilter = 'all' | 'not-started' | 'in-progress' | 'completed';
