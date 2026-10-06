/**
 * @file module.ts
 * @description SDK registration metadata for Milestone 16 — Journal, Notes & Second Brain.
 * @module Features/Journal
 */

import { BookOpen } from 'lucide-react';
import { JOURNAL_ROUTES } from './routes';

export const JournalModule = {
  id: 'journal',
  name: 'Journal & Second Brain',
  description: 'Intelligent knowledge graph, rich markdown notes, daily reflections, and personal memory system.',
  icon: BookOpen,
  category: 'Productivity',
  version: '1.0.0',
  routes: JOURNAL_ROUTES,
};
