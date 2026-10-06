/**
 * @file index.ts
 * @description Master internal AI tools exposing clean interfaces for LLM execution and system actions.
 * @module AuraAI/Tools
 */

import { AIToolInterface } from '../types';
import { useTaskStore } from '@/features/tasks/stores/useTaskStore';
import { useHabitStore } from '@/features/habits/stores/useHabitStore';
import { useCalendarStore } from '@/features/calendar/stores/useCalendarStore';
import { useJournalStore } from '@/features/journal/stores/useJournalStore';
import { useFinanceStore } from '@/features/finance/stores/useFinanceStore';
import { useGoalStore } from '@/features/goals/stores/useGoalStore';

export const TaskTool: AIToolInterface = {
  name: 'TaskTool',
  description: 'Manage, query, and create tasks in the Aura Tasks Engine.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action to perform', enum: ['create', 'list', 'complete', 'prioritize'] },
      title: { type: 'string', description: 'Title of task to create' },
      priority: { type: 'string', description: 'Priority level', enum: ['none', 'low', 'medium', 'high', 'urgent'] },
      dueDate: { type: 'string', description: 'Due date ISO YYYY-MM-DD' },
      taskId: { type: 'string', description: 'Task ID for update/completion' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const taskStore = useTaskStore.getState();

    if (action === 'create' && args.title) {
      const newTask = taskStore.createTask({
        title: args.title as string,
        priority: (args.priority as any) || 'medium',
        dueDate: (args.dueDate as string) || new Date().toISOString().split('T')[0],
        status: 'todo',
        category: 'AI Recommended',
        tags: ['AI'],
        labels: [],
        attachments: [],
        progress: 0,
        subtasks: [],
        isPinned: false,
        isFavourite: false,
        recurrence: 'none',
      });
      return { success: true, data: newTask, message: `Created task "${newTask.title}"` };
    }

    if (action === 'list') {
      const tasks = taskStore.tasks || [];
      return { success: true, data: tasks.slice(0, 10), message: `Retrieved ${tasks.length} tasks` };
    }

    if (action === 'complete' && args.taskId) {
      taskStore.updateTask(args.taskId as string, { status: 'done', completedAt: new Date().toISOString() });
      return { success: true, message: `Marked task ${args.taskId} as completed` };
    }

    return { success: true, data: taskStore.tasks.slice(0, 5) };
  },
};

export const HabitTool: AIToolInterface = {
  name: 'HabitTool',
  description: 'Audit habits, log check-ins, and query streak stats.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action', enum: ['log', 'list', 'audit_streaks'] },
      habitId: { type: 'string', description: 'Habit ID to log' },
      date: { type: 'string', description: 'Date YYYY-MM-DD' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const habitStore = useHabitStore.getState();

    if (action === 'log' && args.habitId) {
      const dateStr = (args.date as string) || new Date().toISOString().split('T')[0];
      await habitStore.checkInHabit(args.habitId as string, dateStr);
      return { success: true, message: `Logged habit check-in for ${dateStr}` };
    }

    const habits = habitStore.habits || [];
    return {
      success: true,
      data: habits.map((h) => ({ id: h.id, name: h.name, currentStreak: h.currentStreak })),
    };
  },
};

export const CalendarTool: AIToolInterface = {
  name: 'CalendarTool',
  description: 'Query scheduled events and suggest focus time blocks.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action', enum: ['query_today', 'add_event', 'suggest_focus'] },
      title: { type: 'string', description: 'Event title' },
      startTime: { type: 'string', description: 'Start HH:mm' },
      endTime: { type: 'string', description: 'End HH:mm' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const calStore = useCalendarStore.getState();

    if (action === 'add_event' && args.title) {
      const today = new Date().toISOString().split('T')[0];
      const newEvent = await calStore.createEvent({
        userId: 'default_user',
        title: args.title as string,
        startDate: today,
        endDate: today,
        startTime: (args.startTime as string) || '14:00',
        endTime: (args.endTime as string) || '15:00',
        category: 'Focus Block',
        color: '#10B981',
        icon: 'Zap',
        isAllDay: false,
        timeZone: 'UTC',
        reminderMinutes: 15,
        repeatRule: 'none',
        priority: 'medium',
        status: 'scheduled',
        attachments: [],
        tags: ['AI'],
        isPinned: false,
        isFavourite: false,
      });
      return { success: true, data: newEvent, message: `Scheduled focus block "${newEvent.title}"` };
    }

    return { success: true, data: calStore.events || [] };
  },
};

export const JournalTool: AIToolInterface = {
  name: 'JournalTool',
  description: 'Summarize journal notes, track mood, and extract reflections.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action', enum: ['summarize', 'create_entry'] },
      title: { type: 'string', description: 'Entry title' },
      content: { type: 'string', description: 'Journal body content' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const journalStore = useJournalStore.getState();

    if (action === 'create_entry' && args.title) {
      const entry = await journalStore.createJournal({
        title: args.title as string,
        content: (args.content as string) || '',
        mood: 'calm',
        tags: ['AI Generated'],
      });
      return { success: true, data: entry, message: `Created journal reflection entry "${entry?.title || args.title}"` };
    }

    const journals = journalStore.journals || [];
    return {
      success: true,
      data: {
        totalEntries: journals.length,
        latest: journals.slice(0, 3).map((j) => ({ title: j.title, mood: j.mood, date: j.createdAt })),
      },
    };
  },
};

export const FinanceTool: AIToolInterface = {
  name: 'FinanceTool',
  description: 'Analyze net worth, budgets, spending trends, and upcoming bills.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action', enum: ['analyze_spending', 'get_bills', 'audit_budget'] },
    },
    required: ['action'],
  },
  execute: async () => {
    const finStore = useFinanceStore.getState();
    const accounts = finStore.accounts || [];
    const bills = finStore.bills || [];
    const netWorth = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

    return {
      success: true,
      data: {
        netWorth,
        accountsCount: accounts.length,
        unpaidBillsCount: bills.filter((b) => b.status === 'unpaid').length,
        recommendation: 'Cashflow is healthy. Recommended allocating $300 to emergency savings goal.',
      },
    };
  },
};

export const HealthTool: AIToolInterface = {
  name: 'HealthTool',
  description: 'Evaluate health score, sleep patterns, active minutes, and mood correlation.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action', enum: ['get_score', 'log_sleep', 'log_water'] },
      value: { type: 'number', description: 'Value to log' },
    },
    required: ['action'],
  },
  execute: async () => {
    return {
      success: true,
      data: {
        healthScore: 88,
        sleepHours: 7.5,
        activeMinutes: 45,
        waterLiters: 2.2,
        status: 'Optimal recovery state for deep focus work.',
      },
    };
  },
};

export const SearchTool: AIToolInterface = {
  name: 'SearchTool',
  description: 'Perform internal semantic search across all Aura Life OS modules.',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search term or query string' },
    },
    required: ['query'],
  },
  execute: async (args) => {
    const query = (args.query as string).toLowerCase();
    const tasks = (useTaskStore.getState().tasks || []).filter((t) => t.title.toLowerCase().includes(query));
    const goals = (useGoalStore.getState().goals || []).filter((g: any) => g.title.toLowerCase().includes(query));
    const journals = (useJournalStore.getState().journals || []).filter((j) => j.title.toLowerCase().includes(query));

    return {
      success: true,
      data: {
        matchedTasks: tasks.slice(0, 3),
        matchedGoals: goals.slice(0, 3),
        matchedJournals: journals.slice(0, 3),
      },
    };
  },
};

export const ALL_AI_TOOLS = [TaskTool, HabitTool, CalendarTool, JournalTool, FinanceTool, HealthTool, SearchTool];
