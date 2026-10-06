/**
 * @file journal.types.ts
 * @description Comprehensive TypeScript types for Milestone 16 — Journal, Notes & Second Brain in Aura Life OS.
 * @module Features/Journal/Types
 */

export type MoodType = 'happy' | 'calm' | 'focused' | 'energetic' | 'anxious' | 'sad' | 'creative' | 'neutral';

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface WeatherInfo {
  condition: 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'windy' | 'clear';
  temperature?: number; // e.g., 22
  unit?: 'C' | 'F';
  locationName?: string; // e.g. "San Francisco, CA"
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: number; // bytes
  type: 'image' | 'pdf' | 'audio' | 'code' | 'file';
  url: string;
  uploadedAt: string;
}

export interface LinkedReference {
  id: string;
  type: 'task' | 'habit' | 'goal' | 'event' | 'note' | 'journal';
  title: string;
  snippet?: string;
  status?: string;
  color?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string; // HTML or Markdown content
  contentJson?: string; // TipTap JSON string
  summary?: string;
  mood: MoodType;
  energyLevel: EnergyLevel;
  weather?: WeatherInfo;
  tags: string[];
  category: string; // e.g., 'Personal', 'Work', 'Ideas', 'Health', 'Gratitude', 'Reflection'
  folderId?: string; // Optional folder placement
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  isFavourite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isLocked: boolean;
  lockPin?: string; // Optional PIN for locked entries
  location?: string;
  attachments: AttachmentItem[];
  wordCount: number;
  readingTimeMinutes: number;
  linkedTaskIds: string[];
  linkedHabitIds: string[];
  linkedGoalIds: string[];
  linkedEventIds: string[];
  linkedNoteIds: string[];
  linkedReferences?: LinkedReference[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteItem {
  id: string;
  userId: string;
  title: string;
  content: string; // HTML/Markdown
  contentJson?: string;
  type: 'quick' | 'rich' | 'markdown' | 'checklist' | 'code' | 'voice';
  tags: string[];
  folderId?: string;
  isFavourite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isLocked: boolean;
  lockPin?: string;
  color?: string; // Card background accent hex
  wordCount: number;
  readingTimeMinutes: number;
  attachments: AttachmentItem[];
  linkedTaskIds: string[];
  linkedHabitIds: string[];
  linkedGoalIds: string[];
  linkedEventIds: string[];
  audioUrl?: string; // For voice notes
  audioDurationSeconds?: number;
  audioTranscript?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderItem {
  id: string;
  userId: string;
  name: string;
  description?: string;
  parentFolderId?: string | null;
  color?: string;
  icon?: string;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TagItem {
  id: string;
  userId: string;
  name: string;
  color?: string;
  usageCount?: number;
  createdAt: string;
}

export type ViewMode = 'journal' | 'notes' | 'second-brain' | 'timeline' | 'analytics' | 'graph';

export type TimelineScale = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'calendar';

export interface JournalSearchFilters {
  query: string;
  folderId?: string;
  selectedTags: string[];
  mood?: MoodType;
  category?: string;
  isFavouriteOnly?: boolean;
  isPinnedOnly?: boolean;
  isArchivedOnly?: boolean;
  isLockedOnly?: boolean;
  hasAttachments?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy: 'updatedAt' | 'createdAt' | 'title' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface JournalAnalyticsSummary {
  currentStreakDays: number;
  longestStreakDays: number;
  totalJournals: number;
  totalNotes: number;
  totalWordsWritten: number;
  totalWritingHours: number;
  entriesThisWeek: number;
  weeklyDistribution: { day: string; count: number; wordCount: number }[];
  moodDistribution: { mood: MoodType; count: number; percentage: number }[];
  topTags: { tag: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
}

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';
