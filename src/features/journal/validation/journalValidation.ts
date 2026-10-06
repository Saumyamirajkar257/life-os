/**
 * @file journalValidation.ts
 * @description Zod validation schemas for Journal, Note, Folder, and Tag data structures.
 * @module Features/Journal/Validation
 */

import { z } from 'zod';

export const moodEnumSchema = z.enum([
  'happy',
  'calm',
  'focused',
  'energetic',
  'anxious',
  'sad',
  'creative',
  'neutral',
]);

export const weatherInfoSchema = z.object({
  condition: z.enum(['sunny', 'rainy', 'cloudy', 'snowy', 'windy', 'clear']),
  temperature: z.number().optional(),
  unit: z.enum(['C', 'F']).optional(),
  locationName: z.string().optional(),
});

export const attachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.enum(['image', 'pdf', 'audio', 'code', 'file']),
  url: z.string(),
  uploadedAt: z.string(),
});

export const journalEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().max(300, 'Title cannot exceed 300 characters'),
  content: z.string(),
  contentJson: z.string().optional(),
  summary: z.string().optional(),
  mood: moodEnumSchema,
  energyLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  weather: weatherInfoSchema.optional(),
  tags: z.array(z.string()),
  category: z.string(),
  folderId: z.string().optional(),
  date: z.string(),
  time: z.string(),
  isFavourite: z.boolean(),
  isPinned: z.boolean(),
  isArchived: z.boolean(),
  isLocked: z.boolean(),
  lockPin: z.string().optional(),
  location: z.string().optional(),
  attachments: z.array(attachmentSchema),
  wordCount: z.number(),
  readingTimeMinutes: z.number(),
  linkedTaskIds: z.array(z.string()),
  linkedHabitIds: z.array(z.string()),
  linkedGoalIds: z.array(z.string()),
  linkedEventIds: z.array(z.string()),
  linkedNoteIds: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const noteItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().max(300),
  content: z.string(),
  contentJson: z.string().optional(),
  type: z.enum(['quick', 'rich', 'markdown', 'checklist', 'code', 'voice']),
  tags: z.array(z.string()),
  folderId: z.string().optional(),
  isFavourite: z.boolean(),
  isPinned: z.boolean(),
  isArchived: z.boolean(),
  isLocked: z.boolean(),
  lockPin: z.string().optional(),
  color: z.string().optional(),
  wordCount: z.number(),
  readingTimeMinutes: z.number(),
  attachments: z.array(attachmentSchema),
  linkedTaskIds: z.array(z.string()),
  linkedHabitIds: z.array(z.string()),
  linkedGoalIds: z.array(z.string()),
  linkedEventIds: z.array(z.string()),
  audioUrl: z.string().optional(),
  audioDurationSeconds: z.number().optional(),
  audioTranscript: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const folderItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  parentFolderId: z.string().nullable().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const tagItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1).max(50),
  color: z.string().optional(),
  usageCount: z.number().optional(),
  createdAt: z.string(),
});
