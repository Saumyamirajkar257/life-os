/**
 * @file PersonalDashboardView.tsx
 * @description Premium, spatial, calm Overview page for Aura Life OS.
 * @module Features/Analytics/Dashboard
 */

import React, { useMemo } from 'react';
import { useTaskStore } from '../../tasks/stores/useTaskStore';
import { useHabitStore } from '../../habits/stores/useHabitStore';
import { useCalendarStore } from '../../calendar/stores/useCalendarStore';
import { useGoalStore } from '../../goals/stores/useGoalStore';
import { useLifeScore } from '../hooks/useLifeScore';
import { useAuth } from '../../auth/hooks/useAuth';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useFinance } from '../../finance/hooks/useFinance';
import { useFinanceCalculations } from '../../finance/hooks/useFinanceCalculations';
import { formatCurrency } from '../../finance/utils/financeUtils';
import {
  CheckCircle2, Circle, Clock, Calendar as CalendarIcon, Target, Sparkles, Plus, ArrowRight, Wallet, Flame
} from 'lucide-react';

export const PersonalDashboardView: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.displayName?.split(' ')[0];
  const today = new Date();
  
  const timeGreeting = useMemo(() => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [today]);

  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const { tasks, completeTask } = useTaskStore();
  const { habits, logs, checkInHabit } = useHabitStore();
  const { events } = useCalendarStore();
  const { goals } = useGoalStore();
  const { summary } = useLifeScore();
  const setActiveSection = useSidebarStore((state) => state.setActiveSection);

  // Derive today's tasks
  const todayTasks = useMemo(() => {
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return tasks.filter((t) => {
      if (t.status === 'done') return false;
      if (!t.dueDate) return true; // Show inbox/unplanned
      const d = new Date(t.dueDate);
      return d >= start && d <= end;
    });
  }, [tasks, today]);
  const focusTasks = todayTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');

  // Derive today's habits
  const todayStr = today.toISOString().split('T')[0];
  const todayLogs = logs.filter((l) => l.date === todayStr);
  const displayHabits = habits.slice(0, 5); // Limit for widget

  // Derive today's events
  const todayEvents = useMemo(() => {
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return events.filter((e) => {
      const eStart = new Date(e.startDate);
      return eStart >= start && eStart <= end;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events, today]);

  // Finance snapshot
  const { accounts } = useFinance();
  const { netWorthSummary, monthlyCashFlow } = useFinanceCalculations();
  const displayGoals = goals.slice(0, 4);

  return (
    <div className="w-full flex flex-col space-y-12 animate-in fade-in duration-500 pt-6">
      
      {/* 1. GREETING & CONTEXT */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-normal tracking-tight text-[var(--color-text-primary)]">
            {timeGreeting}{userName ? `, ${userName}` : '.'}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1.5 text-sm">
            {dateString} <span className="mx-2 opacity-30">•</span> Here's what matters today.
          </p>
        </div>
      </section>

      {/* 2. TODAY SUMMARY (Simple Row) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-[var(--color-border-subtle)]">
        <div className="flex flex-col space-y-1">
          <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Tasks</span>
          <span className="text-xl text-[var(--color-text-primary)] font-medium">{todayTasks.length} pending</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Focus</span>
          <span className="text-xl text-[var(--color-text-primary)] font-medium">{focusTasks.length} high priority</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Habits</span>
          <span className="text-xl text-[var(--color-text-primary)] font-medium">{displayHabits.length} routines</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">Life Score</span>
          <span className="text-xl text-[var(--color-text-primary)] font-medium">{summary.overallScore.toFixed(1)}</span>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Focus & Schedule (Col 1-5) */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* FOCUS TODAY */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-2">
              Focus Today
            </h2>
            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-surface)] transition-colors group">
                    <button
                      onClick={() => completeTask(task.id)}
                      className="mt-0.5 text-[var(--color-text-muted)] hover:text-emerald-400 transition-colors"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] truncate">{task.title}</p>
                      {task.priority === 'urgent' && <span className="text-[10px] text-red-400 font-mono mt-1 block">URGENT</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border-subtle)] text-center">
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">Your focus queue is clear.</p>
                <button
                  onClick={() => setActiveSection('tasks')}
                  className="text-xs font-medium text-[var(--color-text-primary)] hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Add your first focus task
                </button>
              </div>
            )}
          </section>

          {/* SCHEDULE */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-2">
              Today's Schedule
            </h2>
            {todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map((event) => {
                  const d = new Date(event.startDate);
                  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={event.id} className="flex items-center gap-4 p-2">
                      <div className="w-16 text-xs text-[var(--color-text-muted)] text-right font-medium">{time}</div>
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)]" />
                      <div className="text-sm text-[var(--color-text-primary)] truncate">{event.title}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border-subtle)] text-center">
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">Your calendar is open.</p>
                <button
                  onClick={() => setActiveSection('calendar')}
                  className="text-xs font-medium text-[var(--color-text-primary)] hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Add an event
                </button>
              </div>
            )}
          </section>

        </div>

        {/* CENTER COLUMN: Aura Intelligence (Col 6-9) */}
        <div className="lg:col-span-4 space-y-10">
          <section className="space-y-4 h-full">
            <h2 className="text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-accent)]" /> Aura Intelligence
            </h2>
            
            <div className="h-[280px] p-6 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-sm relative overflow-hidden group flex flex-col justify-between">
              {/* Subtle ambient glow inside the box */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              
              <div className="relative z-10 space-y-3">
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  {todayEvents.length === 0 
                    ? "Your day looks open. A good time for deep work or a short planning session."
                    : `You have ${todayEvents.length} events scheduled today. Remember to take short breaks between contexts.`}
                </p>
                {focusTasks.length > 0 && (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-2">
                    Focus on completing "{focusTasks[0].title}" first.
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => setActiveSection('aura-ai')}
                className="relative z-10 text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-1.5 hover:gap-2 transition-all mt-4 w-fit"
              >
                Open Aura <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Habits & Goals (Col 10-12) */}
        <div className="lg:col-span-3 space-y-10">
          
          {/* HABITS */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-2">
              Habits
            </h2>
            {displayHabits.length > 0 ? (
              <div className="space-y-1">
                {displayHabits.map((habit) => {
                  const log = todayLogs.find((l) => l.habitId === habit.id);
                  const isCompleted = log?.status === 'completed';

                  return (
                    <button
                      key={habit.id}
                      onClick={() => !isCompleted && checkInHabit(habit.id, todayStr)}
                      className="w-full p-2.5 rounded-lg hover:bg-[var(--color-surface)] flex items-center justify-between text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm">{habit.emoji || 'o'}</span>
                        <span className="text-sm text-[var(--color-text-primary)] truncate">
                          {habit.name}
                        </span>
                      </div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">Build your first routine.</p>
                <button
                  onClick={() => setActiveSection('habits')}
                  className="text-xs font-medium text-[var(--color-text-primary)] hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Add habit
                </button>
              </div>
            )}
          </section>

          {/* GOALS */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-2">
              Goals
            </h2>
            {displayGoals.length > 0 ? (
              <div className="space-y-3">
                {displayGoals.map((goal) => (
                  <div key={goal.id} className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-primary)] truncate pr-2">{goal.title}</span>
                      <span className="text-[var(--color-text-muted)]">{goal.progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">Define what you're working toward.</p>
                <button
                  onClick={() => setActiveSection('goals')}
                  className="text-xs font-medium text-[var(--color-text-primary)] hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Create a goal
                </button>
              </div>
            )}
          </section>
        </div>

      </div>

      {/* 4. LOWER ROW: FINANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] pb-2">
            Finance Snapshot
          </h2>
          {accounts.length > 0 ? (
            <div className="flex items-center gap-6 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
              <div>
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Net Worth</div>
                <div className="text-lg text-[var(--color-text-primary)] font-medium">
                  {formatCurrency(netWorthSummary.totalNetWorth)}
                </div>
              </div>
              <div className="w-px h-8 bg-[var(--color-border-subtle)]" />
              <div>
                <div className="text-xs text-[var(--color-text-muted)] mb-1">Monthly Flow</div>
                <div className="text-lg text-emerald-400 font-medium">
                  {formatCurrency(monthlyCashFlow.netSavings)}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border-subtle)] text-center">
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">Your financial workspace is ready.</p>
              <button
                onClick={() => setActiveSection('finances')}
                className="text-xs font-medium text-[var(--color-text-primary)] hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Add account
              </button>
            </div>
          )}
        </section>
      </div>

    </div>
  );
};

export default PersonalDashboardView;
