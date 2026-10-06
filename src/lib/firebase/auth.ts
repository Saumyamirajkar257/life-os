/**
 * @file auth.ts
 * @description Firebase Authentication service functions for Email/Password, Google OAuth, Email Verification, Password Reset, and User Profile.
 * @module AuraCore/Lib/Firebase/Auth
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from './config';

export interface AuraUserStub {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
}

export function formatAuthError(error: unknown): string {
  if (!error) return 'An unexpected error occurred.';
  const authError = error as AuthError;
  const code = authError.code;

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completion.';
    case 'auth/operation-not-supported-in-this-app':
    case 'auth/configuration-not-found':
      return 'Apple Sign-In requires Apple Services ID configuration in the Firebase Console. Use Google or Email sign-in in the meantime.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. Reset your password or try again later.';
    case 'auth/requires-recent-login':
      return 'Please log in again to perform this security sensitive operation.';
    case 'auth/network-request-failed':
      return 'Network connectivity error. Please check your internet connection.';
    default:
      return authError.message || 'Authentication failed. Please try again.';
  }
}

export function mapFirebaseUser(user: FirebaseUser | null): AuraUserStub | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
  };
}

export function getCurrentUserStub(): AuraUserStub | null {
  return mapFirebaseUser(auth.currentUser);
}

export async function loginWithGoogleStub(): Promise<AuraUserStub> {
  const result = await signInWithPopup(auth, googleProvider);
  const mapped = mapFirebaseUser(result.user);
  if (!mapped) throw new Error('Failed to retrieve Google user profile.');
  return mapped;
}

export async function loginWithAppleStub(): Promise<AuraUserStub> {
  const result = await signInWithPopup(auth, appleProvider);
  const mapped = mapFirebaseUser(result.user);
  if (!mapped) throw new Error('Failed to retrieve Apple user profile.');
  return mapped;
}

export async function logoutStub(): Promise<void> {
  await signOut(auth);
}

export function onAuthStateChangedStub(callback: (user: AuraUserStub | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, (user) => {
    callback(mapFirebaseUser(user));
  });
}

export async function sendEmailVerificationToUser(): Promise<void> {
  if (auth.currentUser) {
    await firebaseSendEmailVerification(auth.currentUser);
  } else {
    throw new Error('No active user logged in to send email verification.');
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function updateUserProfileDetails(displayName: string, photoURL?: string): Promise<void> {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: displayName || undefined,
      photoURL: photoURL || undefined,
    });
  } else {
    throw new Error('No active user logged in to update profile.');
  }
}
