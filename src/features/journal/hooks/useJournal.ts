/**
 * @file useJournal.ts
 * @description Master React hook providing unified filtering, search, and CRUD methods for Journal, Notes & Second Brain.
 * @module Features/Journal/Hooks
 */

import { useMemo } from 'react';
import { useJournalStore } from '../stores/useJournalStore';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { JournalEntry, NoteItem } from '../types/journal.types';

export const useJournal = () => {
  const { journals, notes, folders, tags, isLoading, error } = useJournalStore();
  const { searchFilters, activeFolderId, selectedTag, smartCollection, unlockedItemIds } = useJournalUIStore();

  // Filtered Journals
  const filteredJournals = useMemo(() => {
    return journals.filter((j) => {
      // Archived filter
      if (smartCollection === 'archived') return j.isArchived;
      if (j.isArchived) return false;

      // Smart collection filters
      if (smartCollection === 'favorites' && !j.isFavourite) return false;
      if (smartCollection === 'pinned' && !j.isPinned) return false;
      if (smartCollection === 'locked' && !j.isLocked) return false;

      // Folder filter
      if (activeFolderId && j.folderId !== activeFolderId) return false;

      // Tag filter
      if (selectedTag && !j.tags.includes(selectedTag)) return false;

      // Query search filter
      if (searchFilters.query.trim()) {
        const q = searchFilters.query.toLowerCase();
        const matchesTitle = j.title.toLowerCase().includes(q);
        const matchesContent = j.content.toLowerCase().includes(q);
        const matchesCategory = j.category.toLowerCase().includes(q);
        const matchesTags = j.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesCategory && !matchesTags) return false;
      }

      // Mood filter
      if (searchFilters.mood && j.mood !== searchFilters.mood) return false;

      return true;
    });
  }, [journals, searchFilters, activeFolderId, selectedTag, smartCollection]);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (smartCollection === 'archived') return n.isArchived;
      if (n.isArchived) return false;

      if (smartCollection === 'favorites' && !n.isFavourite) return false;
      if (smartCollection === 'pinned' && !n.isPinned) return false;
      if (smartCollection === 'locked' && !n.isLocked) return false;

      if (activeFolderId && n.folderId !== activeFolderId) return false;
      if (selectedTag && !n.tags.includes(selectedTag)) return false;

      if (searchFilters.query.trim()) {
        const q = searchFilters.query.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesContent = n.content.toLowerCase().includes(q);
        const matchesTags = n.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTags) return false;
      }

      return true;
    });
  }, [notes, searchFilters, activeFolderId, selectedTag, smartCollection]);

  // Folder Counts mapping
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    folders.forEach((f) => {
      const journalCount = journals.filter((j) => !j.isArchived && j.folderId === f.id).length;
      const noteCount = notes.filter((n) => !n.isArchived && n.folderId === f.id).length;
      counts[f.id] = journalCount + noteCount;
    });
    return counts;
  }, [folders, journals, notes]);

  return {
    journals: filteredJournals,
    allJournals: journals,
    notes: filteredNotes,
    allNotes: notes,
    folders,
    tags,
    folderCounts,
    isLoading,
    error,
    unlockedItemIds,
  };
};
