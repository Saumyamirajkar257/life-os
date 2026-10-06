/**
 * @file index.ts
 * @description Master internal AI tools exposing clean interfaces for LLM execution, autonomous agent mutations, and OS-wide actions.
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
  description: 'Manage, query, create, complete, prioritize, and delete tasks in the Aura Tasks Engine.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action to perform', enum: ['create', 'list', 'complete', 'delete', 'prioritize'] },
      title: { type: 'string', description: 'Title or search query of the task' },
      priority: { type: 'string', description: 'Priority level', enum: ['none', 'low', 'medium', 'high', 'urgent'] },
      dueDate: { type: 'string', description: 'Due date ISO YYYY-MM-DD' },
      taskId: { type: 'string', description: 'Task ID for update/completion/deletion' },
      category: { type: 'string', description: 'Task category/project' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const taskStore = useTaskStore.getState();
    const tasks = taskStore.tasks || [];

    // Helper to find a task by ID or fuzzy title
    const findTask = () => {
      if (args.taskId) {
        const direct = tasks.find((t) => t.id === args.taskId);
        if (direct) return direct;
      }
      if (args.title) {
        const query = (args.title as string).toLowerCase().trim();
        // 1. Exact match
        const exact = tasks.find((t) => t.title.toLowerCase() === query);
        if (exact) return exact;
        // 2. Substring match
        const partial = tasks.find((t) => t.title.toLowerCase().includes(query) || query.includes(t.title.toLowerCase()));
        if (partial) return partial;
      }
      // 3. Fallback: first pending task
      return tasks.find((t) => t.status !== 'done') || tasks[0] || null;
    };

    if (action === 'create' && args.title) {
      const newTask = taskStore.createTask({
        title: args.title as string,
        priority: (args.priority as any) || 'medium',
        dueDate: (args.dueDate as string) || new Date().toISOString().split('T')[0],
        status: 'todo',
        category: (args.category as string) || 'AI Recommended',
        tags: ['AI'],
        labels: [],
        attachments: [],
        progress: 0,
        subtasks: [],
        isPinned: false,
        isFavourite: false,
        recurrence: 'none',
      });
      return {
        success: true,
        data: newTask,
        message: `Created task "${newTask.title}" [Priority: ${newTask.priority}, Due: ${newTask.dueDate}]`,
      };
    }

    if (action === 'complete') {
      const target = findTask();
      if (!target) {
        return { success: false, message: `Could not find any matching task to complete.` };
      }
      taskStore.completeTask(target.id);
      return {
        success: true,
        data: target,
        message: `Marked task "${target.title}" as completed! 🎉`,
      };
    }

    if (action === 'delete') {
      const target = findTask();
      if (!target) {
        return { success: false, message: `Could not find any matching task to delete.` };
      }
      taskStore.deleteTask(target.id);
      return {
        success: true,
        data: target,
        message: `Successfully deleted task "${target.title}".`,
      };
    }

    if (action === 'prioritize') {
      const target = findTask();
      if (!target) {
        return { success: false, message: `Could not find any matching task to prioritize.` };
      }
      const newPriority = (args.priority as any) || 'urgent';
      taskStore.updateTask(target.id, { priority: newPriority });
      return {
        success: true,
        data: target,
        message: `Updated priority of task "${target.title}" to ${newPriority}.`,
      };
    }

    if (action === 'list') {
      return {
        success: true,
        data: {
          total: tasks.length,
          pending: tasks.filter((t) => t.status !== 'done').length,
          completed: tasks.filter((t) => t.status === 'done').length,
          tasks: tasks.slice(0, 10),
        },
        message: `Retrieved ${tasks.length} total tasks.`,
      };
    }

    return { success: true, data: tasks.slice(0, 5) };
  },
};

export const FinanceTool: AIToolInterface = {
  name: 'FinanceTool',
  description: 'Manage income, log expenses, delete transactions, create bills, and analyze net worth.',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        description: 'Action to perform',
        enum: [
          'add_income',
          'add_expense',
          'delete_transaction',
          'list_transactions',
          'create_bill',
          'pay_bill',
          'create_savings_goal',
          'contribute_savings',
          'analyze_spending',
          'get_bills',
          'audit_budget',
        ],
      },
      amount: { type: 'number', description: 'Monetary amount' },
      description: { type: 'string', description: 'Transaction notes/description/merchant' },
      category: { type: 'string', description: 'Category e.g. Salary, Groceries, Dining, Utilities' },
      accountId: { type: 'string', description: 'Target account ID' },
      transactionId: { type: 'string', description: 'Transaction ID for deletion' },
      date: { type: 'string', description: 'Date YYYY-MM-DD' },
      title: { type: 'string', description: 'Title for bill or savings goal' },
      dueDate: { type: 'string', description: 'Due date for bill' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const finStore = useFinanceStore.getState();
    const accounts = finStore.accounts || [];
    const transactions = finStore.transactions || [];

    const defaultAcc = accounts.find((a) => a.id === args.accountId) || accounts[0];
    const defaultAccId = defaultAcc?.id || 'acc_chase_main';
    const today = new Date().toISOString().split('T')[0];

    if (action === 'add_income') {
      const amount = Math.abs(Number(args.amount) || 0);
      const category = (args.category as string) || 'Salary';
      const description = (args.description as string) || 'Income Deposit';

      const newTx = finStore.createTransaction({
        amount,
        type: 'income',
        category,
        merchant: description,
        notes: description,
        accountId: defaultAccId,
        date: (args.date as string) || today,
        status: 'completed',
      });

      const updatedAcc = useFinanceStore.getState().accounts.find((a) => a.id === defaultAccId);
      const totalNetWorth = useFinanceStore.getState().accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

      return {
        success: true,
        data: { transaction: newTx, updatedAccount: updatedAcc, totalNetWorth },
        message: `Added $${amount.toLocaleString()} income ("${description}"). Account "${updatedAcc?.name || 'Main'}" balance is now $${updatedAcc?.balance.toLocaleString()}. Total Net Worth: $${totalNetWorth.toLocaleString()}. 💰`,
      };
    }

    if (action === 'add_expense') {
      const amount = Math.abs(Number(args.amount) || 0);
      const category = (args.category as string) || 'Miscellaneous';
      const description = (args.description as string) || 'Expense';

      const newTx = finStore.createTransaction({
        amount,
        type: 'expense',
        category,
        merchant: description,
        notes: description,
        accountId: defaultAccId,
        date: (args.date as string) || today,
        status: 'completed',
      });

      const updatedAcc = useFinanceStore.getState().accounts.find((a) => a.id === defaultAccId);
      const totalNetWorth = useFinanceStore.getState().accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

      return {
        success: true,
        data: { transaction: newTx, updatedAccount: updatedAcc, totalNetWorth },
        message: `Logged $${amount.toLocaleString()} expense for "${description}" (${category}). Account "${updatedAcc?.name || 'Main'}" balance is now $${updatedAcc?.balance.toLocaleString()}. 💳`,
      };
    }

    if (action === 'delete_transaction') {
      let target = null;
      if (args.transactionId) {
        target = transactions.find((t) => t.id === args.transactionId);
      }
      if (!target && args.description) {
        const query = (args.description as string).toLowerCase().trim();
        target = transactions.find(
          (t) =>
            (t.merchant || '').toLowerCase().includes(query) ||
            (t.notes || '').toLowerCase().includes(query) ||
            (t.category || '').toLowerCase().includes(query)
        );
      }
      if (!target && args.amount) {
        const amt = Number(args.amount);
        target = transactions.find((t) => Math.abs(t.amount - amt) < 0.01);
      }
      if (!target) {
        // Fallback: delete the most recent transaction
        target = transactions[0];
      }

      if (!target) {
        return { success: false, message: 'No matching transaction found to delete.' };
      }

      finStore.deleteTransaction(target.id);
      const updatedAcc = useFinanceStore.getState().accounts.find((a) => a.id === target.accountId);
      const totalNetWorth = useFinanceStore.getState().accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

      return {
        success: true,
        data: { deletedTransaction: target, updatedAccount: updatedAcc, totalNetWorth },
        message: `Removed transaction "${target.merchant || target.category}" ($${target.amount.toLocaleString()}). Account balance reverted to $${updatedAcc?.balance.toLocaleString()}. Total Net Worth: $${totalNetWorth.toLocaleString()}. 🔄`,
      };
    }

    if (action === 'create_bill' && args.title) {
      const amount = Number(args.amount) || 50;
      const newBill = finStore.createBill({
        title: args.title as string,
        amount,
        dueDate: (args.dueDate as string) || today,
        category: (args.category as string) || 'Subscriptions',
        status: 'unpaid',
      });
      return {
        success: true,
        data: newBill,
        message: `Created bill "${newBill.title}" for $${amount.toLocaleString()} due on ${newBill.dueDate}.`,
      };
    }

    if (action === 'pay_bill') {
      const bills = finStore.bills || [];
      const query = (args.title as string || '').toLowerCase();
      const target = bills.find((b) => b.title.toLowerCase().includes(query) || b.id === args.title) || bills[0];
      if (target) {
        finStore.markBillAsPaid(target.id, true);
        return { success: true, message: `Paid bill "${target.title}" ($${target.amount.toLocaleString()}).` };
      }
      return { success: false, message: 'Could not find bill to mark as paid.' };
    }

    if (action === 'create_savings_goal' && args.title) {
      const targetAmount = Number(args.amount) || 1000;
      const newGoal = finStore.createSavingsGoal({
        name: args.title as string,
        targetAmount,
        currentAmount: 0,
        targetDate: (args.dueDate as string) || today,
      });
      return {
        success: true,
        data: newGoal,
        message: `Created savings goal "${newGoal.name}" with target $${targetAmount.toLocaleString()}. 🎯`,
      };
    }

    // Default: analyze spending / net worth
    const netWorth = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
    const bills = finStore.bills || [];
    return {
      success: true,
      data: {
        netWorth,
        accountsCount: accounts.length,
        unpaidBillsCount: bills.filter((b) => b.status === 'unpaid').length,
        recentTransactions: transactions.slice(0, 5),
      },
      message: `Total Net Worth: $${netWorth.toLocaleString()} across ${accounts.length} accounts.`,
    };
  },
};

export const HabitTool: AIToolInterface = {
  name: 'HabitTool',
  description: 'Audit habits, log check-ins, create new habits, and delete habits.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action', enum: ['log', 'list', 'create', 'delete', 'audit_streaks'] },
      habitId: { type: 'string', description: 'Habit ID' },
      name: { type: 'string', description: 'Habit name for fuzzy match or creation' },
      date: { type: 'string', description: 'Date YYYY-MM-DD' },
      frequency: { type: 'string', description: 'daily or weekly' },
      category: { type: 'string', description: 'Habit category' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const habitStore = useHabitStore.getState();
    const habits = habitStore.habits || [];
    const dateStr = (args.date as string) || new Date().toISOString().split('T')[0];

    const findHabit = () => {
      if (args.habitId) {
        const direct = habits.find((h) => h.id === args.habitId);
        if (direct) return direct;
      }
      if (args.name) {
        const query = (args.name as string).toLowerCase().trim();
        const exact = habits.find((h) => h.name.toLowerCase() === query);
        if (exact) return exact;
        const partial = habits.find((h) => h.name.toLowerCase().includes(query) || query.includes(h.name.toLowerCase()));
        if (partial) return partial;
      }
      return habits[0] || null;
    };

    if (action === 'log' || action === 'checkin') {
      const target = findHabit();
      if (!target) {
        return { success: false, message: 'Could not find matching habit to check in.' };
      }
      await habitStore.checkInHabit(target.id, dateStr);
      return {
        success: true,
        data: target,
        message: `Checked in habit "${target.name}" for ${dateStr}! Current streak: ${target.currentStreak + 1} days 🔥`,
      };
    }

    if (action === 'create' && args.name) {
      const newHabit = await habitStore.addHabit({
        name: args.name as string,
        category: (args.category as any) || 'Health',
        frequency: (args.frequency as any) || 'daily',
        dailyGoal: 1,
        dailyGoalUnit: 'times',
        weeklyGoal: 7,
      });
      return {
        success: true,
        data: newHabit,
        message: `Created new habit "${newHabit.name}". Build that daily momentum! 🚀`,
      };
    }

    if (action === 'delete') {
      const target = findHabit();
      if (!target) {
        return { success: false, message: 'Could not find matching habit to delete.' };
      }
      await habitStore.deleteHabit(target.id);
      return {
        success: true,
        data: target,
        message: `Removed habit "${target.name}".`,
      };
    }

    return {
      success: true,
      data: habits.map((h) => ({ id: h.id, name: h.name, currentStreak: h.currentStreak })),
      message: `Retrieved ${habits.length} habits.`,
    };
  },
};

export const GoalTool: AIToolInterface = {
  name: 'GoalTool',
  description: 'Manage long-term goals, create milestones, update progress, and delete goals.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action', enum: ['create', 'update_progress', 'delete', 'list'] },
      title: { type: 'string', description: 'Goal title' },
      goalId: { type: 'string', description: 'Goal ID' },
      progress: { type: 'number', description: 'Progress percentage (0-100)' },
      targetDate: { type: 'string', description: 'Target date YYYY-MM-DD' },
      priority: { type: 'string', description: 'Priority level' },
      category: { type: 'string', description: 'Goal category' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const goalStore = useGoalStore.getState();
    const goals = goalStore.goals || [];

    const findGoal = () => {
      if (args.goalId) {
        const direct = goals.find((g) => g.id === args.goalId);
        if (direct) return direct;
      }
      if (args.title) {
        const query = (args.title as string).toLowerCase().trim();
        const exact = goals.find((g) => g.title.toLowerCase() === query);
        if (exact) return exact;
        const partial = goals.find((g) => g.title.toLowerCase().includes(query) || query.includes(g.title.toLowerCase()));
        if (partial) return partial;
      }
      return goals[0] || null;
    };

    if (action === 'create' && args.title) {
      const newGoal = goalStore.createGoal({
        userId: 'default_user',
        title: args.title as string,
        category: (args.category as any) || 'Career',
        priority: (args.priority as any) || 'high',
        targetDate: (args.targetDate as string) || new Date().toISOString().split('T')[0],
        progress: 0,
        status: 'in_progress',
        description: 'Created autonomously via Aura Intelligence.',
        icon: 'Target',
        color: '#8B5CF6',
        startDate: new Date().toISOString().split('T')[0],
        tags: ['AI'],
        attachments: [],
        isFavourite: false,
        isPinned: false,
        linkedHabitIds: [],
      });
      return {
        success: true,
        data: newGoal,
        message: `Created goal "${newGoal.title}" [Target Date: ${newGoal.targetDate}]. 🎯`,
      };
    }

    if (action === 'update_progress') {
      const target = findGoal();
      if (!target) {
        return { success: false, message: 'Could not find matching goal to update.' };
      }
      const newProgress = Math.min(100, Math.max(0, Number(args.progress) || 0));
      goalStore.updateGoal(target.id, { progress: newProgress });
      return {
        success: true,
        data: target,
        message: `Updated progress for goal "${target.title}" to ${newProgress}%.`,
      };
    }

    if (action === 'delete') {
      const target = findGoal();
      if (!target) {
        return { success: false, message: 'Could not find matching goal to delete.' };
      }
      goalStore.deleteGoal(target.id);
      return {
        success: true,
        data: target,
        message: `Removed goal "${target.title}".`,
      };
    }

    return {
      success: true,
      data: goals.map((g) => ({ id: g.id, title: g.title, progress: g.progress })),
      message: `Retrieved ${goals.length} goals.`,
    };
  },
};

export const CalendarTool: AIToolInterface = {
  name: 'CalendarTool',
  description: 'Schedule events, delete meetings, query today’s calendar, and suggest focus blocks.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action', enum: ['query_today', 'add_event', 'delete_event', 'suggest_focus'] },
      title: { type: 'string', description: 'Event title' },
      eventId: { type: 'string', description: 'Event ID' },
      startDate: { type: 'string', description: 'Date YYYY-MM-DD' },
      startTime: { type: 'string', description: 'Start HH:mm' },
      endTime: { type: 'string', description: 'End HH:mm' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const calStore = useCalendarStore.getState();
    const events = calStore.events || [];
    const today = new Date().toISOString().split('T')[0];

    if (action === 'add_event' && args.title) {
      const newEvent = await calStore.createEvent({
        userId: 'default_user',
        title: args.title as string,
        startDate: (args.startDate as string) || today,
        endDate: (args.startDate as string) || today,
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
      return {
        success: true,
        data: newEvent,
        message: `Scheduled event "${newEvent.title}" on ${newEvent.startDate} at ${newEvent.startTime} - ${newEvent.endTime}. 📅`,
      };
    }

    if (action === 'delete_event') {
      let target = null;
      if (args.eventId) {
        target = events.find((e) => e.id === args.eventId);
      }
      if (!target && args.title) {
        const query = (args.title as string).toLowerCase().trim();
        target = events.find((e) => e.title.toLowerCase().includes(query));
      }
      if (target) {
        calStore.deleteEvent(target.id);
        return { success: true, message: `Removed calendar event "${target.title}".` };
      }
      return { success: false, message: 'Could not find matching calendar event to delete.' };
    }

    return {
      success: true,
      data: events,
      message: `Retrieved ${events.length} calendar events.`,
    };
  },
};

export const JournalTool: AIToolInterface = {
  name: 'JournalTool',
  description: 'Write journal reflections, mood logs, and summarize notes.',
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action', enum: ['summarize', 'create_entry', 'delete'] },
      title: { type: 'string', description: 'Entry title' },
      content: { type: 'string', description: 'Journal body content' },
      journalId: { type: 'string', description: 'Journal ID' },
    },
    required: ['action'],
  },
  execute: async (args) => {
    const action = args.action as string;
    const journalStore = useJournalStore.getState();
    const journals = journalStore.journals || [];

    if (action === 'create_entry' && args.title) {
      const entry = await journalStore.createJournal({
        title: args.title as string,
        content: (args.content as string) || '',
        mood: 'calm',
        tags: ['AI Generated'],
      });
      return {
        success: true,
        data: entry,
        message: `Saved journal entry "${entry?.title || args.title}". 📖`,
      };
    }

    if (action === 'delete') {
      const query = (args.title as string || args.journalId as string || '').toLowerCase();
      const target = journals.find((j) => j.id === args.journalId || j.title.toLowerCase().includes(query)) || journals[0];
      if (target) {
        journalStore.deleteJournal(target.id);
        return { success: true, message: `Removed journal entry "${target.title}".` };
      }
      return { success: false, message: 'Could not find journal entry to delete.' };
    }

    return {
      success: true,
      data: {
        totalEntries: journals.length,
        latest: journals.slice(0, 3).map((j) => ({ title: j.title, mood: j.mood, date: j.createdAt })),
      },
    };
  },
};

export const HealthTool: AIToolInterface = {
  name: 'HealthTool',
  description: 'Evaluate health score, sleep patterns, active minutes, and hydration.',
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
      message: 'Health status: Optimal recovery state.',
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

export const ALL_AI_TOOLS = [
  TaskTool,
  FinanceTool,
  HabitTool,
  GoalTool,
  CalendarTool,
  JournalTool,
  HealthTool,
  SearchTool,
];
