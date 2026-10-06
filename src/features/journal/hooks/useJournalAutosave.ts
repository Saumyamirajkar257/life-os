/**
 * @file useJournalAutosave.ts
 * @description Custom hook for debounced autosaving of Journal and Note editor contents.
 * @module Features/Journal/Hooks
 */

import { useEffect, useRef } from 'react';
import { useJournalEditorState } from '../stores/useJournalEditorState';
import { useJournalStore } from '../stores/useJournalStore';

export const useJournalAutosave = (delayMs = 1500) => {
  const { activeItemId, activeItemType, content, contentJson, isDirty, markSaved, setAutosaveStatus } =
    useJournalEditorState();
  const { updateJournal, updateNote } = useJournalStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!activeItemId || !activeItemType || !isDirty) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setAutosaveStatus('saving');

      if (activeItemType === 'journal') {
        updateJournal(activeItemId, { content, contentJson });
      } else if (activeItemType === 'note') {
        updateNote(activeItemId, { content, contentJson });
      }

      markSaved();
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content, contentJson, isDirty, activeItemId, activeItemType, updateJournal, updateNote, markSaved, setAutosaveStatus, delayMs]);
};
