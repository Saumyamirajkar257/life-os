/**
 * @file useJournalStore.ts
 * @description Primary Zustand store managing journals, notes, folders, and tags with Firestore sync and optimistic updates.
 * @module Features/Journal/Stores
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { JournalEntry, NoteItem, FolderItem, TagItem, MoodType, EnergyLevel } from '../types/journal.types';
import { SEED_JOURNALS, SEED_NOTES, SEED_FOLDERS, SEED_TAGS } from '../constants/journalConstants';
import { journalFirestoreService } from '../services/journalFirestore.service';
import { calculateWordCount, calculateReadingTime, extractSnippet } from '../utils/journalUtils';

interface JournalState {
  journals: JournalEntry[];
  notes: NoteItem[];
  folders: FolderItem[];
  tags: TagItem[];
  isLoading: boolean;
  error: string | null;

  // Sync / Initialization
  loadModuleData: (userId?: string) => Promise<void>;

  // Journal CRUD
  createJournal: (payload: Partial<JournalEntry>) => JournalEntry;
  updateJournal: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  archiveJournal: (id: string) => void;
  restoreJournal: (id: string) => void;
  toggleFavouriteJournal: (id: string) => void;
  togglePinJournal: (id: string) => void;
  duplicateJournal: (id: string) => JournalEntry | null;
  toggleLockJournal: (id: string, pin?: string) => void;

  // Note CRUD
  createNote: (payload: Partial<NoteItem>) => NoteItem;
  updateNote: (id: string, updates: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  restoreNote: (id: string) => void;
  toggleFavouriteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  duplicateNote: (id: string) => NoteItem | null;
  toggleLockNote: (id: string, pin?: string) => void;

  // Folder CRUD
  createFolder: (name: string, description?: string, color?: string) => FolderItem;
  updateFolder: (id: string, updates: Partial<FolderItem>) => void;
  deleteFolder: (id: string) => void;

  // Tag Actions
  createTag: (name: string, color?: string) => TagItem;
  deleteTag: (id: string) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      journals: SEED_JOURNALS,
      notes: SEED_NOTES,
      folders: SEED_FOLDERS,
      tags: SEED_TAGS,
      isLoading: false,
      error: null,

      loadModuleData: async (userId = 'default_user') => {
        set({ isLoading: true, error: null });
        try {
          const [fetchedJournals, fetchedNotes, fetchedFolders, fetchedTags] = await Promise.all([
            journalFirestoreService.fetchJournals(userId),
            journalFirestoreService.fetchNotes(userId),
            journalFirestoreService.fetchFolders(userId),
            journalFirestoreService.fetchTags(userId),
          ]);
          set({
            journals: fetchedJournals,
            notes: fetchedNotes,
            folders: fetchedFolders,
            tags: fetchedTags,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false, error: 'Failed to sync with Firestore, using cached memory.' });
        }
      },

      // --- JOURNAL ACTIONS ---
      createJournal: (payload) => {
        const id = `journal_${Date.now()}`;
        const now = new Date();
        const content = payload.content || '<p>Start writing your reflection...</p>';
        const wordCount = calculateWordCount(content);
        const readingTimeMinutes = calculateReadingTime(wordCount);

        const newJournal: JournalEntry = {
          id,
          userId: payload.userId || 'default_user',
          title: payload.title || 'Untitled Journal Entry',
          content,
          contentJson: payload.contentJson || '',
          summary: extractSnippet(content),
          mood: payload.mood || 'focused',
          energyLevel: payload.energyLevel || 4,
          weather: payload.weather || { condition: 'clear', temperature: 22, unit: 'C', locationName: 'San Francisco, CA' },
          tags: payload.tags || ['Reflection'],
          category: payload.category || 'Personal',
          folderId: payload.folderId || undefined,
          date: payload.date || now.toISOString().split('T')[0],
          time: payload.time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFavourite: payload.isFavourite || false,
          isPinned: payload.isPinned || false,
          isArchived: false,
          isLocked: payload.isLocked || false,
          lockPin: payload.lockPin || '1234',
          location: payload.location || 'San Francisco, CA',
          attachments: payload.attachments || [],
          wordCount,
          readingTimeMinutes,
          linkedTaskIds: payload.linkedTaskIds || [],
          linkedHabitIds: payload.linkedHabitIds || [],
          linkedGoalIds: payload.linkedGoalIds || [],
          linkedEventIds: payload.linkedEventIds || [],
          linkedNoteIds: payload.linkedNoteIds || [],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };

        set((state) => ({ journals: [newJournal, ...state.journals] }));
        journalFirestoreService.saveJournal(newJournal);
        return newJournal;
      },

      updateJournal: (id, updates) => {
        const now = new Date().toISOString();
        let updatedItem: JournalEntry | undefined;

        set((state) => {
          const journals = state.journals.map((j) => {
            if (j.id === id) {
              const newContent = updates.content !== undefined ? updates.content : j.content;
              const wordCount = calculateWordCount(newContent);
              const readingTimeMinutes = calculateReadingTime(wordCount);
              const summary = extractSnippet(newContent);

              updatedItem = {
                ...j,
                ...updates,
                content: newContent,
                wordCount,
                readingTimeMinutes,
                summary,
                updatedAt: now,
              };
              return updatedItem;
            }
            return j;
          });
          return { journals };
        });

        if (updatedItem) {
          journalFirestoreService.saveJournal(updatedItem);
        }
      },

      deleteJournal: (id) => {
        set((state) => ({ journals: state.journals.filter((j) => j.id !== id) }));
        journalFirestoreService.deleteJournal(id);
      },

      archiveJournal: (id) => {
        get().updateJournal(id, { isArchived: true });
      },

      restoreJournal: (id) => {
        get().updateJournal(id, { isArchived: false });
      },

      toggleFavouriteJournal: (id) => {
        const target = get().journals.find((j) => j.id === id);
        if (target) {
          get().updateJournal(id, { isFavourite: !target.isFavourite });
        }
      },

      togglePinJournal: (id) => {
        const target = get().journals.find((j) => j.id === id);
        if (target) {
          get().updateJournal(id, { isPinned: !target.isPinned });
        }
      },

      duplicateJournal: (id) => {
        const target = get().journals.find((j) => j.id === id);
        if (!target) return null;
        return get().createJournal({
          ...target,
          title: `${target.title} (Copy)`,
          isPinned: false,
        });
      },

      toggleLockJournal: (id, pin = '1234') => {
        const target = get().journals.find((j) => j.id === id);
        if (target) {
          get().updateJournal(id, { isLocked: !target.isLocked, lockPin: pin });
        }
      },

      // --- NOTE ACTIONS ---
      createNote: (payload) => {
        const id = `note_${Date.now()}`;
        const now = new Date().toISOString();
        const content = payload.content || '<p>Quick note draft...</p>';
        const wordCount = calculateWordCount(content);
        const readingTimeMinutes = calculateReadingTime(wordCount);

        const newNote: NoteItem = {
          id,
          userId: payload.userId || 'default_user',
          title: payload.title || 'Quick Note',
          content,
          contentJson: payload.contentJson || '',
          type: payload.type || 'quick',
          tags: payload.tags || ['Ideas'],
          folderId: payload.folderId || undefined,
          isFavourite: payload.isFavourite || false,
          isPinned: payload.isPinned || false,
          isArchived: false,
          isLocked: payload.isLocked || false,
          lockPin: payload.lockPin || '1234',
          color: payload.color || '#3B82F6',
          wordCount,
          readingTimeMinutes,
          attachments: payload.attachments || [],
          linkedTaskIds: payload.linkedTaskIds || [],
          linkedHabitIds: payload.linkedHabitIds || [],
          linkedGoalIds: payload.linkedGoalIds || [],
          linkedEventIds: payload.linkedEventIds || [],
          audioUrl: payload.audioUrl,
          audioDurationSeconds: payload.audioDurationSeconds,
          audioTranscript: payload.audioTranscript,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ notes: [newNote, ...state.notes] }));
        journalFirestoreService.saveNote(newNote);
        return newNote;
      },

      updateNote: (id, updates) => {
        const now = new Date().toISOString();
        let updatedItem: NoteItem | undefined;

        set((state) => {
          const notes = state.notes.map((n) => {
            if (n.id === id) {
              const newContent = updates.content !== undefined ? updates.content : n.content;
              const wordCount = calculateWordCount(newContent);
              const readingTimeMinutes = calculateReadingTime(wordCount);

              updatedItem = {
                ...n,
                ...updates,
                content: newContent,
                wordCount,
                readingTimeMinutes,
                updatedAt: now,
              };
              return updatedItem;
            }
            return n;
          });
          return { notes };
        });

        if (updatedItem) {
          journalFirestoreService.saveNote(updatedItem);
        }
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
        journalFirestoreService.deleteNote(id);
      },

      archiveNote: (id) => {
        get().updateNote(id, { isArchived: true });
      },

      restoreNote: (id) => {
        get().updateNote(id, { isArchived: false });
      },

      toggleFavouriteNote: (id) => {
        const target = get().notes.find((n) => n.id === id);
        if (target) {
          get().updateNote(id, { isFavourite: !target.isFavourite });
        }
      },

      togglePinNote: (id) => {
        const target = get().notes.find((n) => n.id === id);
        if (target) {
          get().updateNote(id, { isPinned: !target.isPinned });
        }
      },

      duplicateNote: (id) => {
        const target = get().notes.find((n) => n.id === id);
        if (!target) return null;
        return get().createNote({
          ...target,
          title: `${target.title} (Copy)`,
          isPinned: false,
        });
      },

      toggleLockNote: (id, pin = '1234') => {
        const target = get().notes.find((n) => n.id === id);
        if (target) {
          get().updateNote(id, { isLocked: !target.isLocked, lockPin: pin });
        }
      },

      // --- FOLDER ACTIONS ---
      createFolder: (name, description = '', color = '#8B5CF6') => {
        const id = `folder_${Date.now()}`;
        const now = new Date().toISOString();
        const newFolder: FolderItem = {
          id,
          userId: 'default_user',
          name,
          description,
          color,
          icon: 'Folder',
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
        journalFirestoreService.saveFolder(newFolder);
        return newFolder;
      },

      updateFolder: (id, updates) => {
        const now = new Date().toISOString();
        let updatedItem: FolderItem | undefined;

        set((state) => {
          const folders = state.folders.map((f) => {
            if (f.id === id) {
              updatedItem = { ...f, ...updates, updatedAt: now };
              return updatedItem;
            }
            return f;
          });
          return { folders };
        });

        if (updatedItem) {
          journalFirestoreService.saveFolder(updatedItem);
        }
      },

      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          // Unset folderId on items in this folder
          journals: state.journals.map((j) => (j.folderId === id ? { ...j, folderId: undefined } : j)),
          notes: state.notes.map((n) => (n.folderId === id ? { ...n, folderId: undefined } : n)),
        }));
        journalFirestoreService.deleteFolder(id);
      },

      // --- TAG ACTIONS ---
      createTag: (name, color = '#10B981') => {
        const id = `tag_${Date.now()}`;
        const newTag: TagItem = {
          id,
          userId: 'default_user',
          name,
          color,
          usageCount: 1,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tags: [...state.tags, newTag] }));
        journalFirestoreService.saveTag(newTag);
        return newTag;
      },

      deleteTag: (id) => {
        set((state) => ({ tags: state.tags.filter((t) => t.id !== id) }));
      },
    }),
    {
      name: 'aura-journal-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
