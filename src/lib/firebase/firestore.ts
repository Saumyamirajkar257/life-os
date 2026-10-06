/**
 * @file firestore.ts
 * @description Lazy Firestore initialization and accessor module.
 * @module AuraCore/Lib/Firebase/Firestore
 */

import type { Firestore } from 'firebase/firestore';
import { app } from './config';
import firebaseAppletConfig from '../../../firebase-applet-config.json';

let firestoreInstance: Firestore | null = null;
let firestorePromise: Promise<Firestore> | null = null;

/**
 * Lazy accessor for the Firebase Firestore database instance.
 * Dynamically imports 'firebase/firestore' on first invocation.
 */
export async function getDb(): Promise<Firestore> {
  if (firestoreInstance) return firestoreInstance;
  if (!firestorePromise) {
    firestorePromise = (async () => {
      const { getFirestore } = await import('firebase/firestore');
      const databaseId = (firebaseAppletConfig as any)?.firestoreDatabaseId;
      firestoreInstance = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
      return firestoreInstance;
    })();
  }
  return firestorePromise;
}

/**
 * Helper to dynamically load the firestore SDK module when needed.
 */
export async function getFirestoreSDK() {
  return await import('firebase/firestore');
}
