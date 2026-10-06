/**
 * @file PersonalDashboardView.tsx
 * @description Master personal dashboard assembling Today's Command Center.
 * @module Features/Analytics/Dashboard
 */

import React, { useMemo } from 'react';
import { useTaskStore } from '../../tasks/stores/useTaskStore';
import { useHabitStore } from '../../habits/stores/useHabitStore';
import { useCalendarStore } from '../../calendar/stores/useCalendarStore';
import { useGoalStore } from '../../goals/stores/useGoalStore';
import { useLifeScore } from '../hooks/useLifeScore';
import { useAuth } from '../../auth/hooks/useAuth';
import { 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  Target, 
  Sparkles, 
  Plus, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Activity
} from 'lucide-react';


export const PersonalDashboardView: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.displayName?.split(' ')[0] || 'Saumya';
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const { tasks } = useTaskStore();
  const { habits, logs } = useHabitStore();
  const { events } = useCalendarStore();
  const { goals } = useGoalStore();
  const { summary } = useLifeScore();

  // 1. Data Processing
  const todayStr = today.toISOString().split('T')[0];

  // Tasks
  const allTodayTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'archived');
  const completedTasks = allTodayTasks.filter(t => t.status === 'done');
  const focusTasks = allTodayTasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      const priorityWeight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1, none: 0 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    })
    .slice(0, 3);

  // Habits
  const activeHabits = habits.filter(h => h.status === 'active');
  const todayLogs = logs.filter(l => l.date === todayStr);
  const completedHabitsCount = activeHabits.filter(h => {
    const log = todayLogs.find(l => l.habitId === h.id);
    return log && log.status === 'completed';
  }).length;
  const displayHabits = activeHabits.slice(0, 4);

  // Calendar
  const todayEvents = events
    .filter(e => e.startDate === todayStr && e.status !== 'archived' && e.status !== 'cancelled')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  // Focus Time
  const focusTime = allTodayTasks.reduce((acc, t) => acc + (t.estimatedDuration || 0), 0);

  // Goals
  const displayGoals = goals.filter(g => g.status === 'in_progress').slice(0, 3);

  // Dynamic Status Message
  const getDynamicStatus = () => {
    if (focusTasks.length > 0) return `You have ${focusTasks.length} priorities today.`;
    if (allTodayTasks.length > 0 && completedTasks.length === allTodayTasks.length) return "You've crushed all your tasks today!";
    return "You're on track today.";
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HERO / TODAY HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-1">
            Good morning, {userName}.
          </h1>
          <p className="text-slate-400 text-lg font-medium">{dateString}</p>
          <div className="flex items-center gap-2 mt-4 text-emerald-400 text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
            <Sparkles className="w-4 h-4" />
            {getDynamicStatus()}
          </div>
        </div>
        
        {/* 9. QUICK ACTIONS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium whitespace-nowrap">
            <Plus className="w-4 h-4" /> Task
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium whitespace-nowrap">
            <Plus className="w-4 h-4" /> Habit
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium whitespace-nowrap">
            <Plus className="w-4 h-4" /> Event
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium whitespace-nowrap">
            <Plus className="w-4 h-4" /> Note
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity text-sm font-medium whitespace-nowrap border border-[var(--color-accent)]/20 ml-2">
            <BrainCircuit className="w-4 h-4" /> Aura AI
          </button>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ROW 1: Progress (8) & Life Score (4) */}
        <div className="lg:col-span-8 bg-[var(--color-surface)]/40 border border-[var(--color-border)]/50 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-[var(--color-border)] transition-colors">
          <h2 className="text-xs font-bold text-slate-500 tracking-wider mb-5 uppercase">Today's Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tasks
              </div>
              <div className="text-2xl font-semibold text-white">
                {completedTasks.length} <span className="text-slate-600 text-lg">/ {allTodayTasks.length || 0}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Target className="w-4 h-4 text-blue-400" /> Habits
              </div>
              <div className="text-2xl font-semibold text-white">
                {completedHabitsCount} <span className="text-slate-600 text-lg">/ {activeHabits.length || 0}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Clock className="w-4 h-4 text-amber-400" /> Focus
              </div>
              <div className="text-2xl font-semibold text-white">
                {focusTime} <span className="text-slate-600 text-sm font-medium">min</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <CalendarIcon className="w-4 h-4 text-purple-400" /> Events
              </div>
              <div className="text-2xl font-semibold text-white">
                {todayEvents.length}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-gradient-to-br from-[var(--color-surface)]/60 to-emerald-950/20 border border-[var(--color-border)]/50 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center shadow-sm hover:border-[var(--color-border)] transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-500 tracking-wider mb-1 uppercase">Life Score</h2>
              <div className="text-4xl font-black text-white tracking-tight">{summary.overallScore}</div>
              <div className="text-sm font-medium text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +{summary.netChange} this week
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
               <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-l-transparent border-b-transparent transform rotate-45" />
               <Activity className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* ROW 2: Focus Today (Full Width or 12) */}
        <div className="lg:col-span-12 bg-[var(--color-surface)]/40 border border-[var(--color-border)]/50 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-[var(--color-border)] transition-colors">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Focus Today</h2>
          </div>
          
          {focusTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {focusTasks.map(task => (
                <div key={task.id} className="p-4 rounded-2xl bg-[var(--color-surface-elevated)]/50 border border-[var(--color-border)]/50 hover:border-[var(--color-border)] transition-colors group cursor-pointer flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex-shrink-0 group-hover:border-emerald-500 transition-colors" />
                      {task.priority === 'urgent' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">URGENT</span>}
                      {task.priority === 'high' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">HIGH</span>}
                    </div>
                    <h3 className="font-semibold text-slate-200 line-clamp-2 leading-snug">{task.title}</h3>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-xs font-medium text-slate-500">
                    {task.dueTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.dueTime}</span>}
                    {task.estimatedDuration && <span>{task.estimatedDuration} min</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)]/20">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium mb-1">No priorities yet.</p>
              <button className="text-sm font-medium text-[var(--color-accent)] hover:opacity-80">Create Task</button>
            </div>
          )}
        </div>

        {/* ROW 3: Timeline (6) & Habits (6) */}
        <div className="lg:col-span-6 bg-[var(--color-surface)]/40 border border-[var(--color-border)]/50 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-[var(--color-border)] transition-colors">
          <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-5">Today's Timeline</h2>
          {todayEvents.length > 0 ? (
            <div className="space-y-4">
              {todayEvents.map((event, idx) => (
                <div key={event.id} className="flex gap-4 items-start group cursor-pointer">
                  <div className="text-xs font-mono font-medium text-slate-400 pt-1 w-12 shrink-0">{event.startTime}</div>
                  <div className="relative pb-4 flex-1">
                    {idx !== todayEvents.length - 1 && <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-800" />}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 z-10 group-hover:border-[var(--color-accent)] transition-colors">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color || 'var(--color-accent)' }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-200">{event.title}</div>
                        {(event.location || event.category) && (
                          <div className="text-xs text-slate-500 mt-0.5">{event.location || event.category}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)]/20">
              <CalendarIcon className="w-8 h-8 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium mb-1">Your day is clear.</p>
              <button className="text-sm font-medium text-[var(--color-accent)] hover:opacity-80">Add Event</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-[var(--color-surface)]/40 border border-[var(--color-border)]/50 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-[var(--color-border)] transition-colors">
          <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-5">Today's Habits</h2>
          {displayHabits.length > 0 ? (
            <div className="space-y-3">
              {displayHabits.map(habit => {
                const log = todayLogs.find(l => l.habitId === habit.id);
                const isCompleted = log?.status === 'completed';
                
                return (
                  <div key={habit.id} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-surface-elevated)]/50 border border-[var(--color-border)]/50 hover:border-[var(--color-border)] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isCompleted ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-800/50 border border-slate-700/50'}`}>
                        {habit.emoji || '✨'}
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{habit.name}</div>
                        <div className="text-xs text-slate-500">{habit.dailyGoal} {habit.dailyGoalUnit}</div>
                      </div>
                    </div>
                    <div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-slate-400 transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)]/20">
              <Target className="w-8 h-8 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium mb-1">No habits scheduled today.</p>
              <button className="text-sm font-medium text-[var(--color-accent)] hover:opacity-80">Add Habit</button>
            </div>
          )}
        </div>

        {/* ROW 4: Goals (6) & Aura Insight (6) */}
        <div className="lg:col-span-6 bg-[var(--color-surface)]/40 border border-[var(--color-border)]/50 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-[var(--color-border)] transition-colors">
          <div className="flex items-center justify-between mb-5">
             <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Active Goals</h2>
             <button className="text-xs font-medium text-slate-500 hover:text-white flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
          </div>
          {displayGoals.length > 0 ? (
            <div className="space-y-4">
              {displayGoals.map(goal => (
                <div key={goal.id} className="cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{goal.title}</span>
                    <span className="text-xs font-medium text-slate-500">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${goal.progress}%`, backgroundColor: goal.color || 'var(--color-accent)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-4 text-center border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)]/20">
              <Target className="w-8 h-8 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium mb-1">Set a goal to start tracking progress.</p>
              <button className="text-sm font-medium text-[var(--color-accent)] hover:opacity-80">Create Goal</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-950/20 to-[var(--color-surface)]/40 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-indigo-500/40 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <h2 className="text-xs font-bold text-indigo-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4" /> Aura Insight
          </h2>
          <div className="mt-4 space-y-4">
            <p className="text-slate-200 text-base leading-relaxed">
              {focusTasks.length > 0 
                ? `You have ${focusTasks.length} unfinished tasks due today. Prioritize "${focusTasks[0].title}" as it is marked ${focusTasks[0].priority}.` 
                : "Your schedule is clear today. It's a great opportunity to review your active goals or capture new thoughts in your journal."}
            </p>
            <button className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 hover:text-white transition-colors text-sm font-medium">
              {focusTasks.length > 0 ? 'Plan My Day' : 'View Goals'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
