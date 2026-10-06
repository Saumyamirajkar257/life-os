/**
 * @file calendarConstants.ts
 * @description Master constants and initial seed data for Milestone 15 Calendar & Planner Module.
 * @module Features/Calendar/Constants
 */

import { EventCategory, CalendarEventItem, EventPriority, EventStatus, RepeatRule } from '../types/calendar.types';

export const EVENT_CATEGORIES: { name: EventCategory; color: string; icon: string; bgClass: string }[] = [
  { name: 'Work', color: '#3B82F6', icon: 'Briefcase', bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { name: 'Meeting', color: '#8B5CF6', icon: 'Users', bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { name: 'Deep Work', color: '#10B981', icon: 'Zap', bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { name: 'Personal', color: '#F59E0B', icon: 'User', bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { name: 'Health & Wellness', color: '#06B6D4', icon: 'Heart', bgClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { name: 'Learning', color: '#EC4899', icon: 'BookOpen', bgClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { name: 'Social', color: '#14B8A6', icon: 'Smile', bgClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  { name: 'Travel', color: '#6366F1', icon: 'Plane', bgClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { name: 'Custom', color: '#64748B', icon: 'Calendar', bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
];

export const REPEAT_OPTIONS: { value: RepeatRule; label: string }[] = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Every day' },
  { value: 'weekly', label: 'Every week' },
  { value: 'monthly', label: 'Every month' },
  { value: 'yearly', label: 'Every year' },
];

export const REMINDER_OPTIONS = [
  { value: 0, label: 'At time of event' },
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 1440, label: '1 day before' },
];

export const EVENT_PRIORITY_CONFIG: Record<EventPriority, { label: string; badgeClass: string }> = {
  low: { label: 'Low', badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  medium: { label: 'Medium', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  high: { label: 'High', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  urgent: { label: 'Urgent', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export const EVENT_STATUS_CONFIG: Record<EventStatus, { label: string; badgeClass: string }> = {
  scheduled: { label: 'Scheduled', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  completed: { label: 'Completed', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'Cancelled', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  archived: { label: 'Archived', badgeClass: 'bg-slate-700/30 text-slate-400 border-slate-700/50' },
};

const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_EVENTS: CalendarEventItem[] = [
  {
    id: 'evt_1',
    userId: 'default_user',
    title: 'Aura Life OS Milestone 15 Strategy Sync',
    description: 'Review Calendar & Planner architecture, Firestore synchronization, and unified dashboard widgets.',
    category: 'Work',
    color: '#3B82F6',
    icon: 'Briefcase',
    location: 'Aura Virtual Conference Room 1',
    startDate: getTodayStr(0),
    endDate: getTodayStr(0),
    startTime: '09:30',
    endTime: '10:30',
    isAllDay: false,
    timeZone: 'America/Los_Angeles',
    reminderMinutes: 15,
    repeatRule: 'none',
    notes: 'Focus on clean responsive time grids and keyboard navigation.',
    tags: ['Aura', 'Architecture', 'Milestone15'],
    attachments: [],
    priority: 'high',
    status: 'scheduled',
    isFavourite: true,
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt_2',
    userId: 'default_user',
    title: 'Deep Work: Autonomous Agent Refactoring',
    description: 'Uninterrupted 2-hour coding session focusing on Antigravity runtime optimizations.',
    category: 'Deep Work',
    color: '#10B981',
    icon: 'Zap',
    location: 'Home Studio',
    startDate: getTodayStr(0),
    endDate: getTodayStr(0),
    startTime: '11:00',
    endTime: '13:00',
    isAllDay: false,
    timeZone: 'America/Los_Angeles',
    reminderMinutes: 10,
    repeatRule: 'daily',
    notes: 'Keep notifications silent.',
    tags: ['Code', 'DeepWork', 'AI'],
    attachments: [],
    priority: 'urgent',
    status: 'scheduled',
    isFavourite: true,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt_3',
    userId: 'default_user',
    title: 'Marathon Base Pace Run (10km)',
    description: 'Zone 2 aerobic endurance run at 5:15 min/km pace.',
    category: 'Health & Wellness',
    color: '#06B6D4',
    icon: 'Heart',
    location: 'Riverside Trail Park',
    startDate: getTodayStr(0),
    endDate: getTodayStr(0),
    startTime: '17:30',
    endTime: '18:30',
    isAllDay: false,
    timeZone: 'America/Los_Angeles',
    reminderMinutes: 30,
    repeatRule: 'weekly',
    notes: 'Hydrate well before starting.',
    tags: ['Running', 'Fitness', 'Goal2'],
    attachments: [],
    priority: 'medium',
    status: 'scheduled',
    isFavourite: false,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt_4',
    userId: 'default_user',
    title: 'Quarterly Financial & Portfolio Review',
    description: 'Assess index funds, dividend yields, and tax strategy.',
    category: 'Personal',
    color: '#F59E0B',
    icon: 'DollarSign',
    location: 'Aura Finance Dashboard',
    startDate: getTodayStr(2),
    endDate: getTodayStr(2),
    startTime: '14:00',
    endTime: '15:00',
    isAllDay: false,
    timeZone: 'America/Los_Angeles',
    reminderMinutes: 60,
    repeatRule: 'none',
    notes: 'Cross-reference with Goal 3 objectives.',
    tags: ['Finance', 'Investing'],
    attachments: [],
    priority: 'medium',
    status: 'scheduled',
    isFavourite: false,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
