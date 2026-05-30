'use client';

import { ListTodo, Calendar, Clock, Tag } from 'lucide-react';
import { type TaskView, type TaskStatusFilter } from '../types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskFiltersProps {
  activeView: TaskView;
  setActiveView: (view: TaskView) => void;
  activeStatus: TaskStatusFilter;
  setActiveStatus: (status: TaskStatusFilter) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  counts: {
    views: { all: number; today: number; upcoming: number };
    status: { all: number; notStarted: number; completed: number };
    tags: Record<string, number>;
  };
}

export function TaskFilters({
  activeView,
  setActiveView,
  activeStatus,
  setActiveStatus,
  selectedTag,
  setSelectedTag,
  counts,
}: TaskFiltersProps) {
  const viewsList = [
    { id: 'all' as TaskView, label: 'My Tasks', icon: ListTodo, count: counts.views.all },
    { id: 'today' as TaskView, label: 'Today', icon: Clock, count: counts.views.today },
    { id: 'upcoming' as TaskView, label: 'Upcoming', icon: Calendar, count: counts.views.upcoming },
  ];

  const statusList = [
    { id: 'all' as TaskStatusFilter, label: 'All Statuses', count: counts.status.all },
    { id: 'not-started' as TaskStatusFilter, label: 'In Progress', count: counts.status.notStarted },
    { id: 'completed' as TaskStatusFilter, label: 'Completed', count: counts.status.completed },
  ];

  const tagsList = ['Work', 'Personal', 'Health', 'Urgent'];

  const tagColors: Record<string, string> = {
    Work: 'bg-zinc-500',
    Personal: 'bg-zinc-400',
    Health: 'bg-zinc-600',
    Urgent: 'bg-white',
  };

  return (
    <div className="flex flex-col gap-6 w-full lg:w-[260px] shrink-0">
      {/* Views */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
        <h3 className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Views</h3>
        <div className="flex flex-col gap-1">
          {viewsList.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id && !selectedTag;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSelectedTag(null);
                }}
                className={cn(
                  "relative flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left",
                  isActive 
                    ? "text-black bg-white" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <span className={cn("text-xs font-mono shrink-0", isActive ? "text-black/60" : "text-white/30")}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
        <h3 className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Status</h3>
        <div className="flex flex-col gap-1">
          {statusList.map((item) => {
            const isActive = activeStatus === item.id && !selectedTag;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveStatus(item.id);
                  setSelectedTag(null);
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left",
                  isActive 
                    ? "text-black bg-white" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <span>{item.label}</span>
                <span className={cn("text-xs font-mono shrink-0", isActive ? "text-black/60" : "text-white/30")}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
        <h3 className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Tags</h3>
        <div className="flex flex-col gap-1">
          {tagsList.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isActive ? null : tag)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left",
                  isActive 
                    ? "text-black bg-white" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-2 h-2 rounded-full", tagColors[tag] || 'bg-white/50')} />
                  <span>{tag}</span>
                </div>
                <span className={cn("text-xs font-mono shrink-0", isActive ? "text-black/60" : "text-white/30")}>
                  {counts.tags[tag] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
