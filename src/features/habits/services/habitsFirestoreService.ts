/**
 * @file habitsFirestoreService.ts
 * @description Firestore service for habits and logs CRUD, real-time sync, and batch operations with Firebase skill error handling.
 * @module Features/Habits/Services/HabitsFirestoreService
 */

import { auth } from '@/lib/firebase/config';
import { getDb, getFirestoreSDK } from '@/lib/firebase/firestore';
import { HabitItem, HabitLog } from '../types/habit.types';
import { habitFirestoreConverter, habitLogFirestoreConverter } from './habitsConverter';

export { auth };

const HABITS_COLLECTION = 'habits';
const LOGS_COLLECTION = 'habit_logs';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
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
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path,
  };
  console.warn('Firestore Error Handled in Habits:', JSON.stringify(errInfo));
  return errInfo;
}

/** Test Firestore connection at boot */
export async function testHabitsConnection(): Promise<boolean> {
  try {
    const db = await getDb();
    const { doc, getDocFromServer } = await getFirestoreSDK();
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn('Firestore client is offline, using optimistic habits cache.');
    }
    return false;
  }
}

/** Subscribe to live real-time habit updates for a user */
export function subscribeToHabits(
  userId: string,
  onData: (habits: HabitItem[]) => void,
  onError?: (err: any) => void
) {
  let unsubscribe: (() => void) | null = null;
  let isCancelled = false;

  getDb().then(async (db) => {
    if (isCancelled) return;
    const { collection, query, where, onSnapshot } = await getFirestoreSDK();
    const ref = collection(db, HABITS_COLLECTION).withConverter(habitFirestoreConverter);
    const q = query(ref, where('userId', '==', userId));

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data());
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, HABITS_COLLECTION);
        if (onError) onError(error);
      }
    );
  }).catch((error) => {
    handleFirestoreError(error, OperationType.LIST, HABITS_COLLECTION);
    if (onError) onError(error);
  });

  return () => {
    isCancelled = true;
    if (unsubscribe) unsubscribe();
  };
}

/** Subscribe to live habit logs for a user */
export function subscribeToHabitLogs(
  userId: string,
  onData: (logs: HabitLog[]) => void,
  onError?: (err: any) => void
) {
  let unsubscribe: (() => void) | null = null;
  let isCancelled = false;

  getDb().then(async (db) => {
    if (isCancelled) return;
    const { collection, query, where, onSnapshot } = await getFirestoreSDK();
    const ref = collection(db, LOGS_COLLECTION).withConverter(habitLogFirestoreConverter);
    const q = query(ref, where('userId', '==', userId));

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data());
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, LOGS_COLLECTION);
        if (onError) onError(error);
      }
    );
  }).catch((error) => {
    handleFirestoreError(error, OperationType.LIST, LOGS_COLLECTION);
    if (onError) onError(error);
  });

  return () => {
    isCancelled = true;
    if (unsubscribe) unsubscribe();
  };
}

/** Save or update a habit document */
export async function saveHabitToFirestore(habit: HabitItem): Promise<void> {
  try {
    const db = await getDb();
    const { doc, setDoc } = await getFirestoreSDK();
    const docRef = doc(db, HABITS_COLLECTION, habit.id).withConverter(habitFirestoreConverter);
    await setDoc(docRef, habit, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${HABITS_COLLECTION}/${habit.id}`);
  }
}

/** Delete a habit document */
export async function deleteHabitFromFirestore(habitId: string): Promise<void> {
  try {
    const db = await getDb();
    const { doc, deleteDoc } = await getFirestoreSDK();
    const docRef = doc(db, HABITS_COLLECTION, habitId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${HABITS_COLLECTION}/${habitId}`);
  }
}

/** Save or update a habit log document */
export async function saveHabitLogToFirestore(log: HabitLog): Promise<void> {
  try {
    const db = await getDb();
    const { doc, setDoc } = await getFirestoreSDK();
    const docRef = doc(db, LOGS_COLLECTION, log.id).withConverter(habitLogFirestoreConverter);
    await setDoc(docRef, log, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${LOGS_COLLECTION}/${log.id}`);
  }
}

/** Delete a habit log document */
export async function deleteHabitLogFromFirestore(logId: string): Promise<void> {
  try {
    const db = await getDb();
    const { doc, deleteDoc } = await getFirestoreSDK();
    const docRef = doc(db, LOGS_COLLECTION, logId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${LOGS_COLLECTION}/${logId}`);
  }
}

/** Bulk update habits status */
export async function bulkUpdateHabitsInFirestore(
  habitIds: string[],
  updates: Partial<HabitItem>
): Promise<void> {
  try {
    const db = await getDb();
    const { doc, writeBatch } = await getFirestoreSDK();
    const batch = writeBatch(db);
    habitIds.forEach((id) => {
      const docRef = doc(db, HABITS_COLLECTION, id);
      batch.update(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, HABITS_COLLECTION);
  }
}
