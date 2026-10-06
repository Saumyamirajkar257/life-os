/**
 * @file auraAgentDispatcher.ts
 * @description Autonomous Agent Dispatcher and Natural Language Intent Parser for Aura Life OS.
 * Translates natural language prompts into real mutations across Tasks, Finances, Habits, Goals, Calendar, and Journal.
 * @module AuraAI/Agent
 */

import { TaskTool, FinanceTool, HabitTool, GoalTool, CalendarTool, JournalTool, ALL_AI_TOOLS } from '../tools';
import { useTaskStore } from '@/features/tasks/stores/useTaskStore';
import { useFinanceStore } from '@/features/finance/stores/useFinanceStore';
import { useHabitStore } from '@/features/habits/stores/useHabitStore';
import { useGoalStore } from '@/features/goals/stores/useGoalStore';
import { useCalendarStore } from '@/features/calendar/stores/useCalendarStore';

export interface DispatchResult {
  handled: boolean;
  actionName?: string;
  responseMarkdown: string;
}

export class AuraAgentDispatcher {
  /**
   * Evaluates user prompt and dispatches mutations to the appropriate Aura module.
   */
  public static async dispatch(prompt: string): Promise<DispatchResult> {
    const raw = prompt.trim();
    const text = raw.toLowerCase();

    // 1. --- FINANCE: ADD MONEY / INCOME ---
    // Examples: "add money i got salary 1000", "i got salary 1000", "i received 1000 salary", "add money 1000", "got paid 1500"
    if (
      (text.includes('salary') || text.includes('income') || text.includes('add money') || text.includes('got paid') || text.includes('deposit')) &&
      !text.startsWith('delete') && !text.startsWith('remove') && !text.startsWith('how much')
    ) {
      const amountMatch = raw.match(/[$€£₹]?\s*(\d+(?:,\d+)*(?:\.\d+)?)/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        if (amount > 0) {
          let category = 'Salary';
          let description = 'Salary deposit';
          if (text.includes('bonus')) {
            category = 'Bonus';
            description = 'Bonus income';
          } else if (text.includes('freelance')) {
            category = 'Freelance';
            description = 'Freelance earnings';
          } else if (text.includes('investment') || text.includes('dividend')) {
            category = 'Investments';
            description = 'Investment return';
          } else if (text.includes('salary')) {
            category = 'Salary';
            description = 'Salary deposit';
          } else {
            category = 'Income';
            description = 'Funds deposit';
          }

          const res = await FinanceTool.execute({
            action: 'add_income',
            amount,
            category,
            description,
          });

          const finState = useFinanceStore.getState();
          const netWorth = finState.accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
          const primaryAcc = finState.accounts[0];

          return {
            handled: true,
            actionName: 'Add Income',
            responseMarkdown: `> ⚡ **Action Executed:** Income Added & Balance Synchronized

### 💰 Added $${amount.toLocaleString()} Income to Ledger

- **Amount:** +$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- **Category:** ${category}
- **Description:** ${description}
- **Account:** ${primaryAcc?.name || 'Primary Checking'}
- **New Account Balance:** $${(primaryAcc?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
- **Total Net Worth:** $${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}

Your financial ledger has been updated and real-time balances synchronized across your Financial OS.`,
          };
        }
      }
    }

    // 2. --- FINANCE: LOG EXPENSE / SPENT MONEY ---
    // Examples: "spent 50 on groceries", "bought coffee for 5", "log expense 100 on dining", "paid 30 for gas"
    if (
      (text.includes('spent') || text.includes('bought') || text.includes('expense') || text.includes('paid') || text.includes('spend')) &&
      !text.startsWith('delete') && !text.startsWith('remove') && !text.startsWith('how much') && !text.includes('salary') && !text.includes('got paid')
    ) {
      const amountMatch = raw.match(/[$€£₹]?\s*(\d+(?:,\d+)*(?:\.\d+)?)/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        if (amount > 0) {
          // Infer category & description
          let category = 'Miscellaneous';
          let description = 'General Expense';

          if (text.includes('grocer') || text.includes('supermarket')) {
            category = 'Groceries';
            description = 'Groceries';
          } else if (text.includes('coffee') || text.includes('starbucks') || text.includes('cafe')) {
            category = 'Food & Dining';
            description = 'Coffee';
          } else if (text.includes('dinner') || text.includes('lunch') || text.includes('food') || text.includes('restaurant') || text.includes('dining')) {
            category = 'Food & Dining';
            description = text.includes('dinner') ? 'Dinner' : text.includes('lunch') ? 'Lunch' : 'Restaurant Dining';
          } else if (text.includes('uber') || text.includes('gas') || text.includes('fuel') || text.includes('taxi') || text.includes('commute')) {
            category = 'Transportation';
            description = text.includes('gas') ? 'Gas refill' : 'Transportation / Rideshare';
          } else if (text.includes('bill') || text.includes('utilities') || text.includes('wifi') || text.includes('electricity')) {
            category = 'Utilities';
            description = 'Utilities bill';
          } else if (text.includes('amazon') || text.includes('shopping') || text.includes('clothes')) {
            category = 'Shopping';
            description = 'Online Shopping';
          } else {
            // Extract whatever followed "on" or "for"
            const onMatch = raw.match(/(?:on|for)\s+([a-zA-Z0-9\s]+)/i);
            if (onMatch && onMatch[1]) {
              description = onMatch[1].trim();
            }
          }

          const res = await FinanceTool.execute({
            action: 'add_expense',
            amount,
            category,
            description,
          });

          const finState = useFinanceStore.getState();
          const netWorth = finState.accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
          const primaryAcc = finState.accounts[0];

          return {
            handled: true,
            actionName: 'Log Expense',
            responseMarkdown: `> ⚡ **Action Executed:** Expense Logged & Balance Deducted

### 💳 Logged $${amount.toLocaleString()} Expense

- **Amount:** -$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- **Category:** ${category}
- **Description:** ${description}
- **Account:** ${primaryAcc?.name || 'Primary Checking'}
- **New Account Balance:** $${(primaryAcc?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
- **Total Net Worth:** $${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}

The expense has been written to your financial ledger and your accounts have updated.`,
          };
        }
      }
    }

    // 3. --- FINANCE: DELETE / REMOVE TRANSACTION ---
    // Examples: "remove transaction salary", "delete the 1000 salary transaction", "delete last transaction", "remove transaction"
    if (
      (text.includes('transaction') || text.includes('salary') || text.includes('expense')) &&
      (text.startsWith('delete') || text.startsWith('remove') || text.startsWith('revert') || text.includes('remove the') || text.includes('delete the')) &&
      !text.includes('task') && !text.includes('habit') && !text.includes('goal') && !text.includes('event')
    ) {
      let query = '';
      if (text.includes('salary')) query = 'salary';
      else if (text.includes('grocer')) query = 'groceries';
      else if (text.includes('coffee')) query = 'coffee';

      const amountMatch = raw.match(/[$€£₹]?\s*(\d+(?:,\d+)*(?:\.\d+)?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined;

      const res = await FinanceTool.execute({
        action: 'delete_transaction',
        description: query,
        amount,
      });

      const finState = useFinanceStore.getState();
      const netWorth = finState.accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

      return {
        handled: true,
        actionName: 'Delete Transaction',
        responseMarkdown: `> ⚡ **Action Executed:** Transaction Removed

### 🔄 Transaction Removed from Ledger

${res.message}

- **Updated Total Net Worth:** $${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}

Your account balance has been restored to reflect this reversal.`,
      };
    }

    // 4. --- TASKS: COMPLETE TASK ---
    // Examples: "i completed this task", "completed task buy groceries", "mark task Review Aura as done", "complete task", "finish task"
    if (
      (text.includes('completed') || text.includes('complete') || text.includes('finish') || text.includes('mark') || text.includes('done with')) &&
      (text.includes('task') || text.includes('todo') || text.includes('this task') || text.includes('review aura'))
    ) {
      // Extract task title if provided
      let taskTitle = '';
      const match = raw.match(/(?:task|todo)?\s*(?:named|called|titled)?\s*[:"']?([^"'\n]+?)["']?\s*(?:as done|done|completed|finished)?$/i);
      if (match && match[1] && !match[1].toLowerCase().includes('this task') && !match[1].toLowerCase().includes('a task')) {
        taskTitle = match[1].replace(/^(i\s+)?(completed|complete|finished|mark\s+as\s+done|finish)\s+(task\s+)?/i, '').trim();
      }

      // If user typed "i completed task Review Aura Life OS Architecture"
      const taskExplicit = raw.match(/task\s+([A-Za-z0-9\s!_#-]+)/i);
      if (taskExplicit && taskExplicit[1] && !taskExplicit[1].toLowerCase().includes('done')) {
        taskTitle = taskExplicit[1].replace(/\s+(as\s+done|done)$/i, '').trim();
      }

      const res = await TaskTool.execute({
        action: 'complete',
        title: taskTitle,
      });

      const taskStore = useTaskStore.getState();
      const pendingCount = (taskStore.tasks || []).filter((t) => t.status !== 'done').length;

      if (res.success && res.data) {
        const task = res.data as any;
        return {
          handled: true,
          actionName: 'Complete Task',
          responseMarkdown: `> ⚡ **Action Executed:** Task Completed

### 🎉 Task Marked as Done

- **Title:** **${task.title}**
- **Priority:** ${task.priority.toUpperCase()}
- **Status:** Done (100%)
- **Completed At:** ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

You now have **${pendingCount} pending task${pendingCount === 1 ? '' : 's'}** remaining on your board. Keep crushing your day!`,
        };
      } else {
        return {
          handled: true,
          actionName: 'Complete Task',
          responseMarkdown: `> ⚠️ **Task Notice:** ${res.message}\n\nYou currently have **${pendingCount} active tasks** in your Tasks Engine.`,
        };
      }
    }

    // 5. --- TASKS: CREATE / ADD TASK ---
    // Examples: "add a new task buy groceries !high", "add task wireframe dashboard", "create task finish report"
    if (
      (text.startsWith('add task') || text.startsWith('create task') || text.startsWith('add a task') || text.startsWith('add a new task') || text.startsWith('new task')) ||
      ((text.includes('add') || text.includes('create')) && text.includes('task'))
    ) {
      let rawTitle = raw.replace(/^(add|create)\s+(a\s+)?(new\s+)?task\s*[:]?\s*/i, '').trim();

      // Extract priority modifier
      let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
      if (rawTitle.includes('!urgent') || rawTitle.includes('urgent')) {
        priority = 'urgent';
        rawTitle = rawTitle.replace(/!urgent/gi, '').replace(/\burgent\b/gi, '').trim();
      } else if (rawTitle.includes('!high') || rawTitle.includes('high priority')) {
        priority = 'high';
        rawTitle = rawTitle.replace(/!high/gi, '').replace(/\bhigh priority\b/gi, '').trim();
      } else if (rawTitle.includes('!low') || rawTitle.includes('low priority')) {
        priority = 'low';
        rawTitle = rawTitle.replace(/!low/gi, '').replace(/\blow priority\b/gi, '').trim();
      }

      // Extract due date
      const today = new Date();
      let dueDate = today.toISOString().split('T')[0];
      if (rawTitle.toLowerCase().includes('tomorrow')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate = tomorrow.toISOString().split('T')[0];
        rawTitle = rawTitle.replace(/\btomorrow\b/gi, '').trim();
      }

      const res = await TaskTool.execute({
        action: 'create',
        title: rawTitle || 'Untitled Task',
        priority,
        dueDate,
      });

      const taskStore = useTaskStore.getState();
      const totalCount = (taskStore.tasks || []).length;

      return {
        handled: true,
        actionName: 'Create Task',
        responseMarkdown: `> ⚡ **Action Executed:** Created Task in Engine

### ✅ New Task Created Successfully

- **Title:** **${rawTitle || 'Untitled Task'}**
- **Priority:** ${priority.toUpperCase()}
- **Due Date:** ${dueDate}
- **Status:** To Do
- **Total Board Tasks:** ${totalCount}

Your task has been added to the Aura Tasks Engine and will sync with your cloud workspace.`,
      };
    }

    // 6. --- TASKS: REMOVE / DELETE TASK ---
    // Examples: "remove task buy groceries", "delete task Finish quarterly review", "remove a task", "delete task"
    if (
      (text.startsWith('remove task') || text.startsWith('delete task') || text.startsWith('remove a task') || text.startsWith('delete a task')) ||
      ((text.includes('remove') || text.includes('delete')) && text.includes('task'))
    ) {
      let rawTitle = raw.replace(/^(remove|delete)\s+(the\s+)?(a\s+)?task\s*[:]?\s*/i, '').trim();

      const res = await TaskTool.execute({
        action: 'delete',
        title: rawTitle,
      });

      const taskStore = useTaskStore.getState();
      const totalCount = (taskStore.tasks || []).length;

      return {
        handled: true,
        actionName: 'Delete Task',
        responseMarkdown: `> ⚡ **Action Executed:** Task Deleted

### 🗑️ Task Removed from Workspace

${res.message}

- **Remaining Tasks:** ${totalCount} tasks active.`,
      };
    }

    // 7. --- HABITS: CHECK-IN / LOG HABIT ---
    // Examples: "checked habit meditation", "did my morning workout", "log habit reading", "checked habit"
    if (
      (text.includes('habit') || text.includes('workout') || text.includes('meditation') || text.includes('reading')) &&
      (text.includes('check') || text.includes('logged') || text.includes('did') || text.includes('done') || text.includes('complete')) &&
      !text.startsWith('add') && !text.startsWith('create') && !text.startsWith('delete') && !text.startsWith('remove')
    ) {
      let habitName = raw.replace(/^(checked|check in|log|did|completed)\s+(habit\s+)?/i, '').trim();
      if (!habitName || habitName.toLowerCase().includes('habit')) {
        habitName = text.includes('workout') ? 'Morning Workout' : text.includes('meditation') ? 'Meditation' : 'Reading';
      }

      const res = await HabitTool.execute({
        action: 'log',
        name: habitName,
      });

      return {
        handled: true,
        actionName: 'Log Habit',
        responseMarkdown: `> ⚡ **Action Executed:** Habit Check-in Recorded

### 🔥 Habit Check-in Registered

${res.message}

Keep the streak going! Consistency is the bedrock of mastery.`,
      };
    }

    // 8. --- HABITS: CREATE / ADD HABIT ---
    // Examples: "add habit Drink 2L water", "create habit Read 20 pages"
    if (
      (text.startsWith('add habit') || text.startsWith('create habit') || text.startsWith('new habit')) ||
      ((text.includes('add') || text.includes('create')) && text.includes('habit'))
    ) {
      const habitName = raw.replace(/^(add|create)\s+(a\s+)?(new\s+)?habit\s*[:]?\s*/i, '').trim();
      const res = await HabitTool.execute({
        action: 'create',
        name: habitName || 'New Daily Habit',
      });

      return {
        handled: true,
        actionName: 'Create Habit',
        responseMarkdown: `> ⚡ **Action Executed:** New Habit Initialized

### 🌟 Habit Created

${res.message}

Your new habit has been placed into your Daily Habit cadence.`,
      };
    }

    // 9. --- HABITS: DELETE / REMOVE HABIT ---
    if (
      (text.startsWith('remove habit') || text.startsWith('delete habit')) ||
      ((text.includes('remove') || text.includes('delete')) && text.includes('habit'))
    ) {
      const habitName = raw.replace(/^(remove|delete)\s+(the\s+)?habit\s*[:]?\s*/i, '').trim();
      const res = await HabitTool.execute({
        action: 'delete',
        name: habitName,
      });

      return {
        handled: true,
        actionName: 'Delete Habit',
        responseMarkdown: `> ⚡ **Action Executed:** Habit Removed\n\n${res.message}`,
      };
    }

    // 10. --- GOALS: CREATE GOAL ---
    // Examples: "create goal Launch Startup", "add goal Run Marathon"
    if (
      (text.startsWith('add goal') || text.startsWith('create goal') || text.startsWith('new goal')) ||
      ((text.includes('add') || text.includes('create')) && text.includes('goal'))
    ) {
      const goalTitle = raw.replace(/^(add|create)\s+(a\s+)?(new\s+)?goal\s*[:]?\s*/i, '').trim();
      const res = await GoalTool.execute({
        action: 'create',
        title: goalTitle || 'Major Milestone Goal',
      });

      return {
        handled: true,
        actionName: 'Create Goal',
        responseMarkdown: `> ⚡ **Action Executed:** Long-Term Goal Created

### 🎯 Goal Initialized

${res.message}

Linked to your Goals & Milestones Roadmap.`,
      };
    }

    // 11. --- GOALS: UPDATE PROGRESS ---
    // Examples: "update goal Launch Startup to 80%", "update goal progress 75%"
    if (text.includes('goal') && (text.includes('update') || text.includes('progress') || text.includes('%'))) {
      const percentMatch = raw.match(/(\d+)%/);
      const progress = percentMatch ? parseInt(percentMatch[1], 10) : 50;
      let goalTitle = raw.replace(/^(update|set)\s+(goal\s+)?/i, '').replace(/to\s+\d+%.*$/i, '').trim();

      const res = await GoalTool.execute({
        action: 'update_progress',
        title: goalTitle,
        progress,
      });

      return {
        handled: true,
        actionName: 'Update Goal Progress',
        responseMarkdown: `> ⚡ **Action Executed:** Goal Progress Updated\n\n${res.message}`,
      };
    }

    // 12. --- GOALS: DELETE GOAL ---
    if ((text.startsWith('delete goal') || text.startsWith('remove goal')) || ((text.includes('delete') || text.includes('remove')) && text.includes('goal'))) {
      const goalTitle = raw.replace(/^(remove|delete)\s+(the\s+)?goal\s*[:]?\s*/i, '').trim();
      const res = await GoalTool.execute({
        action: 'delete',
        title: goalTitle,
      });

      return {
        handled: true,
        actionName: 'Delete Goal',
        responseMarkdown: `> ⚡ **Action Executed:** Goal Removed\n\n${res.message}`,
      };
    }

    // 13. --- CALENDAR: SCHEDULE EVENT ---
    // Examples: "schedule meeting with team tomorrow at 2pm", "add event Focus Time"
    if (text.includes('schedule') || text.includes('add event') || text.includes('calendar')) {
      if (text.includes('meeting') || text.includes('event') || text.includes('focus') || text.includes('session')) {
        const title = raw.replace(/^(schedule|add event)\s+/i, '').trim();
        const res = await CalendarTool.execute({
          action: 'add_event',
          title: title || 'Scheduled Block',
        });

        return {
          handled: true,
          actionName: 'Schedule Event',
          responseMarkdown: `> ⚡ **Action Executed:** Event Scheduled on Calendar\n\n${res.message}`,
        };
      }
    }

    // 14. --- JOURNAL: CREATE ENTRY ---
    // Examples: "journal today was productive and peaceful", "write journal entry [x]"
    if (text.startsWith('journal') || text.startsWith('write journal') || text.startsWith('log reflection')) {
      const content = raw.replace(/^(journal|write journal|log reflection)\s*[:]?\s*/i, '').trim();
      const res = await JournalTool.execute({
        action: 'create_entry',
        title: `Reflection — ${new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
        content,
      });

      return {
        handled: true,
        actionName: 'Create Journal Reflection',
        responseMarkdown: `> ⚡ **Action Executed:** Reflection Saved to Second Brain\n\n${res.message}`,
      };
    }

    // 15. --- GENERAL REAL-TIME QUERIES (FINANCES, TASKS, HABITS) ---
    if (text.includes('how much money') || text.includes('my balance') || text.includes('net worth') || text.includes('audit my finances')) {
      const finState = useFinanceStore.getState();
      const netWorth = finState.accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
      const accountsList = finState.accounts.map((a) => `- **${a.name}:** $${(a.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} (${a.type.toUpperCase()})`).join('\n');

      return {
        handled: true,
        actionName: 'Financial Overview',
        responseMarkdown: `### 💰 Real-Time Financial OS Overview

- **Total Net Worth:** **$${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}**
- **Connected Accounts (${finState.accounts.length}):**
${accountsList}

- **Recent Transactions:** ${finState.transactions.length} entries recorded in ledger.
- **Unpaid Bills:** ${finState.bills.filter((b) => b.status === 'unpaid').length} pending.`,
      };
    }

    if (text.includes('list my tasks') || text.includes('what are my tasks') || text.includes('show tasks')) {
      const taskStore = useTaskStore.getState();
      const tasks = taskStore.tasks || [];
      const pending = tasks.filter((t) => t.status !== 'done');
      const taskLines = pending.slice(0, 8).map((t) => `- [ ] **${t.title}** \`[${t.priority.toUpperCase()}]\` (Due: ${t.dueDate || 'Today'})`).join('\n');

      return {
        handled: true,
        actionName: 'Tasks Overview',
        responseMarkdown: `### 📋 Active Tasks (${pending.length} pending / ${tasks.length} total)

${taskLines || 'No pending tasks! You are all caught up.'}

*You can complete, prioritize, or delete any task simply by asking me.*`,
      };
    }

    // Not a direct actionable intent command
    return {
      handled: false,
      responseMarkdown: '',
    };
  }
}
