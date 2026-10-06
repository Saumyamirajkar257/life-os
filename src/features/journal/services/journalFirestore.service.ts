/**
 * @file journalFirestore.service.ts
 * @description Firestore service handling CRUD operations, error handling, and real-time state sync for Milestone 16.
 * @module Features/Journal/Services
 */

import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { auth } from '@/lib/firebase/config';
import { getDb, getFirestoreSDK } from '@/lib/firebase/firestore';
import { JournalEntry, NoteItem, FolderItem, TagItem } from '../types/journal.types';
import { SEED_JOURNALS, SEED_NOTES, SEED_FOLDERS, SEED_TAGS } from '../constants/journalConstants';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || 'default_user',
      email: auth?.currentUser?.email || null,
    },
    operationType,
    path,
  };
  console.warn(`Firestore Warning [${operationType}] on ${path}:`, errInfo.error);
}

// Converters
export const journalConverter: FirestoreDataConverter<JournalEntry> = {
  toFirestore: (journal: JournalEntry) => ({ ...journal }),
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): JournalEntry => {
    const data = snapshot.data(options);
    return data as JournalEntry;
  },
};

export const noteConverter: FirestoreDataConverter<NoteItem> = {
  toFirestore: (note: NoteItem) => ({ ...note }),
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): NoteItem => {
    const data = snapshot.data(options);
    return data as NoteItem;
  },
};

export const folderConverter: FirestoreDataConverter<FolderItem> = {
  toFirestore: (folder: FolderItem) => ({ ...folder }),
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FolderItem => {
    const data = snapshot.data(options);
    return data as FolderItem;
  },
};

export const tagConverter: FirestoreDataConverter<TagItem> = {
  toFirestore: (tag: TagItem) => ({ ...tag }),
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): TagItem => {
    const data = snapshot.data(options);
    return data as TagItem;
  },
};

export const journalFirestoreService = {
  // --- JOURNALS ---
  async fetchJournals(userId: string): Promise<JournalEntry[]> {
    const collectionPath = 'journals';
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(
        collection(db, collectionPath).withConverter(journalConverter),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => doc.data());
      return items.length > 0 ? items : SEED_JOURNALS;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return SEED_JOURNALS;
    }
  },

  async saveJournal(journal: JournalEntry): Promise<void> {
    const path = `journals/${journal.id}`;
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      await setDoc(doc(db, 'journals', journal.id).withConverter(journalConverter), journal);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteJournal(journalId: string): Promise<void> {
    const path = `journals/${journalId}`;
    try {
      const db = await getDb();
      const { doc, deleteDoc } = await getFirestoreSDK();
      await deleteDoc(doc(db, 'journals', journalId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- NOTES ---
  async fetchNotes(userId: string): Promise<NoteItem[]> {
    const collectionPath = 'notes';
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(
        collection(db, collectionPath).withConverter(noteConverter),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => doc.data());
      return items.length > 0 ? items : SEED_NOTES;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return SEED_NOTES;
    }
  },

  async saveNote(note: NoteItem): Promise<void> {
    const path = `notes/${note.id}`;
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      await setDoc(doc(db, 'notes', note.id).withConverter(noteConverter), note);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteNote(noteId: string): Promise<void> {
    const path = `notes/${noteId}`;
    try {
      const db = await getDb();
      const { doc, deleteDoc } = await getFirestoreSDK();
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- FOLDERS ---
  async fetchFolders(userId: string): Promise<FolderItem[]> {
    const collectionPath = 'folders';
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(
        collection(db, collectionPath).withConverter(folderConverter),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => doc.data());
      return items.length > 0 ? items : SEED_FOLDERS;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return SEED_FOLDERS;
    }
  },

  async saveFolder(folder: FolderItem): Promise<void> {
    const path = `folders/${folder.id}`;
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      await setDoc(doc(db, 'folders', folder.id).withConverter(folderConverter), folder);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteFolder(folderId: string): Promise<void> {
    const path = `folders/${folderId}`;
    try {
      const db = await getDb();
      const { doc, deleteDoc } = await getFirestoreSDK();
      await deleteDoc(doc(db, 'folders', folderId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // --- TAGS ---
  async fetchTags(userId: string): Promise<TagItem[]> {
    const collectionPath = 'tags';
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(
        collection(db, collectionPath).withConverter(tagConverter),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => doc.data());
      return items.length > 0 ? items : SEED_TAGS;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return SEED_TAGS;
    }
  },

  async saveTag(tag: TagItem): Promise<void> {
    const path = `tags/${tag.id}`;
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      await setDoc(doc(db, 'tags', tag.id).withConverter(tagConverter), tag);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
};
