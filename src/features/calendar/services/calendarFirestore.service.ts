/**
 * @file calendarFirestore.service.ts
 * @description Firestore CRUD service and data converters for Events and Planner Notes.
 * @module Features/Calendar/Services
 */

import type { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { getDb, getFirestoreSDK } from '@/lib/firebase/firestore';
import { CalendarEventItem, PlannerNote } from '../types/calendar.types';
import { INITIAL_EVENTS } from '../constants/calendarConstants';

const EVENTS_COLLECTION = 'events';
const PLANNER_COLLECTION = 'planner';

export const calendarEventConverter = {
  toFirestore: (event: CalendarEventItem) => {
    return { ...event };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): CalendarEventItem => {
    const data = snapshot.data(options);
    return data as CalendarEventItem;
  },
};

export const plannerNoteConverter = {
  toFirestore: (planner: PlannerNote) => {
    return { ...planner };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PlannerNote => {
    const data = snapshot.data(options);
    return data as PlannerNote;
  },
};

export async function fetchUserEvents(userId: string): Promise<CalendarEventItem[]> {
  try {
    const db = await getDb();
    const { collection, query, where, getDocs } = await getFirestoreSDK();
    const q = query(
      collection(db, EVENTS_COLLECTION).withConverter(calendarEventConverter),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const events: CalendarEventItem[] = [];
    querySnapshot.forEach((docSnap) => {
      events.push(docSnap.data());
    });
    return events.length > 0 ? events : INITIAL_EVENTS;
  } catch (error) {
    console.error('[CalendarService] Error fetching user events:', error);
    return INITIAL_EVENTS;
  }
}

export async function saveUserEvent(event: CalendarEventItem): Promise<void> {
  try {
    const db = await getDb();
    const { doc, setDoc } = await getFirestoreSDK();
    const ref = doc(db, EVENTS_COLLECTION, event.id).withConverter(calendarEventConverter);
    await setDoc(ref, event, { merge: true });
  } catch (error) {
    console.error('[CalendarService] Error saving event:', error);
  }
}

export async function deleteUserEvent(eventId: string): Promise<void> {
  try {
    const db = await getDb();
    const { doc, deleteDoc } = await getFirestoreSDK();
    const ref = doc(db, EVENTS_COLLECTION, eventId);
    await deleteDoc(ref);
  } catch (error) {
    console.error('[CalendarService] Error deleting event:', error);
  }
}

export async function fetchUserPlannerNote(userId: string, dateStr: string): Promise<PlannerNote | null> {
  try {
    const db = await getDb();
    const { collection, query, where, getDocs } = await getFirestoreSDK();
    const docId = `${userId}_${dateStr}`;
    const q = query(
      collection(db, PLANNER_COLLECTION).withConverter(plannerNoteConverter),
      where('userId', '==', userId),
      where('date', '==', dateStr)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('[CalendarService] Error fetching planner note:', error);
    return null;
  }
}

export async function saveUserPlannerNote(planner: PlannerNote): Promise<void> {
  try {
    const db = await getDb();
    const { doc, setDoc } = await getFirestoreSDK();
    const docId = `${planner.userId}_${planner.date}`;
    const ref = doc(db, PLANNER_COLLECTION, docId).withConverter(plannerNoteConverter);
    await setDoc(ref, planner, { merge: true });
  } catch (error) {
    console.error('[CalendarService] Error saving planner note:', error);
  }
}
