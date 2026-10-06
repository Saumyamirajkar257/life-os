/**
 * @file routes.ts
 * @description Route declarations for Journal, Notes & Second Brain module.
 * @module Features/Journal
 */

import { JournalPage } from './pages/JournalPage';

export const JOURNAL_ROUTES = [
  {
    path: '/journal',
    component: JournalPage,
    exact: true,
  },
];
