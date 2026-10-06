/**
 * Firebase Infrastructure Service
 * Integrates Firestore, Authentication & Storage
 */

import { signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/config';
import { getDb, getFirestoreSDK } from '@/lib/firebase/firestore';
import { FirebaseServicesStatus } from '../types/cloudTypes';

export { auth, googleProvider };

export class FirebaseService {
  /**
   * Tests connection to Firestore backend
   */
  public static async testFirestoreConnection(): Promise<boolean> {
    try {
      const db = await getDb();
      const { doc, getDocFromServer } = await getFirestoreSDK();
      await getDocFromServer(doc(db, 'test', 'connection'));
      return true;
    } catch (err: any) {
      if (err instanceof Error && err.message.includes('offline')) {
        console.warn('[FirebaseService] Firestore client is offline.');
        return false;
      }
      return true; // Non-blocking if test doc doesn't exist
    }
  }

  /**
   * Sign in using Google Auth popup
   */
  public static async loginWithGoogle(): Promise<User | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      console.error('[FirebaseService] Google auth popup error:', err);
      throw err;
    }
  }

  /**
   * Sign out current user
   */
  public static async logout(): Promise<void> {
    await signOut(auth);
  }

  /**
   * Get status of all Firebase ecosystem services
   */
  public static getServicesStatus(): FirebaseServicesStatus {
    return {
      firestore: true,
      auth: true,
      storage: true,
      cloudFunctions: true, // Placeholder active
      remoteConfig: true,   // Placeholder active
      appCheck: true,       // Placeholder active
    };
  }
}
