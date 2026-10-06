/**
 * @file tasksFirestoreService.ts
 * @description Firestore service for tasks CRUD, real-time listeners, and batch operations with Firebase skill error handling.
 * @module Features/Tasks/Services/TasksFirestoreService
 */

import { auth } from '@/lib/firebase/config';
import { getDb, getFirestoreSDK } from '@/lib/firebase/firestore';
import { TaskItem } from '../types/task.types';
import { taskFirestoreConverter } from './tasksConverter';

export { auth };

const COLLECTION_NAME = 'tasks';

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
  console.warn('Firestore Error Handled:', JSON.stringify(errInfo));
  return errInfo;
}

/** Test Firestore connection at boot */
export async function testTasksConnection(): Promise<boolean> {
  try {
    const db = await getDb();
    const { doc, getDocFromServer } = await getFirestoreSDK();
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn('Firestore client is offline, using optimistic cache fallback.');
    }
    return false;
  }
}

/** Subscribe to live real-time task updates for a user */
export function subscribeToTasks(
  userId: string,
  onData: (tasks: TaskItem[]) => void,
  onError?: (err: any) => void
) {
  let unsubscribe: (() => void) | null = null;
  let isCancelled = false;

  getDb().then(async (db) => {
    if (isCancelled) return;
    const { collection, query, where, onSnapshot } = await getFirestoreSDK();
    const tasksRef = collection(db, COLLECTION_NAME).withConverter(taskFirestoreConverter);
    const q = query(tasksRef, where('userId', '==', userId));

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data());
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
        if (onError) onError(error);
      }
    );
  }).catch((error) => {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    if (onError) onError(error);
  });

  return () => {
    isCancelled = true;
    if (unsubscribe) unsubscribe();
  };
}

/** Fetch all tasks once */
export async function fetchTasksFromFirestore(userId: string): Promise<TaskItem[]> {
  try {
    const db = await getDb();
    const { collection, query, where, getDocs } = await getFirestoreSDK();
    const tasksRef = collection(db, COLLECTION_NAME).withConverter(taskFirestoreConverter);
    const q = query(tasksRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    return [];
  }
}

/** Save or create a task document */
export async function saveTaskToFirestore(task: TaskItem): Promise<void> {
  try {
    const db = await getDb();
    const { doc, setDoc } = await getFirestoreSDK();
    const taskDocRef = doc(db, COLLECTION_NAME, task.id).withConverter(taskFirestoreConverter);
    await setDoc(taskDocRef, task, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${task.id}`);
  }
}

/** Delete a task document */
export async function deleteTaskFromFirestore(taskId: string): Promise<void> {
  try {
    const db = await getDb();
    const { doc, deleteDoc } = await getFirestoreSDK();
    const taskDocRef = doc(db, COLLECTION_NAME, taskId);
    await deleteDoc(taskDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${taskId}`);
  }
}

/** Bulk delete tasks */
export async function bulkDeleteTasksInFirestore(taskIds: string[]): Promise<void> {
  try {
    const db = await getDb();
    const { doc, writeBatch } = await getFirestoreSDK();
    const batch = writeBatch(db);
    taskIds.forEach((id) => {
      const docRef = doc(db, COLLECTION_NAME, id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
}

/** Bulk update tasks */
export async function bulkUpdateTasksInFirestore(
  taskIds: string[],
  updates: Partial<TaskItem>
): Promise<void> {
  try {
    const db = await getDb();
    const { doc, writeBatch } = await getFirestoreSDK();
    const batch = writeBatch(db);
    taskIds.forEach((id) => {
      const docRef = doc(db, COLLECTION_NAME, id);
      batch.update(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
}
