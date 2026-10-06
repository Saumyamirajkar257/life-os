/**
 * @file useAuthActions.ts
 * @description Hook providing authentication mutation functions (login, signup, google login, password reset, email verification, logout, profile update).
 * @module Features/Auth/Hooks/UseAuthActions
 */

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '@/lib/firebase/config';
import { formatAuthError } from '@/lib/firebase/auth';
import { useAuthContext } from '../context/AuthContext';
import { useNotificationStore } from '@/stores/useNotificationStore';

export function useAuthActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setError, clearError, navigateToPage, reloadUser } = useAuthContext();
  const { addNotification } = useNotificationStore();

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    setIsSubmitting(true);
    clearError();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      addNotification({
        title: 'Welcome Back',
        message: 'Successfully authenticated to Aura Life OS.',
        type: 'success',
      });
      return true;
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      addNotification({
        title: 'Authentication Failed',
        message: msg,
        type: 'error',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (email: string, pass: string, displayName: string): Promise<boolean> => {
    setIsSubmitting(true);
    clearError();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        if (displayName) {
          await firebaseUpdateProfile(cred.user, { displayName });
        }
        await sendEmailVerification(cred.user);
      }
      addNotification({
        title: 'Account Created',
        message: 'A verification link has been dispatched to your email.',
        type: 'success',
      });
      navigateToPage('verify-email');
      return true;
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      addNotification({
        title: 'Registration Failed',
        message: msg,
        type: 'error',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (): Promise<boolean> => {
    setIsSubmitting(true);
    clearError();
    try {
      await signInWithPopup(auth, googleProvider);
      addNotification({
        title: 'Google Sign-In Successful',
        message: 'Authenticated via Google account.',
        type: 'success',
      });
      return true;
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      addNotification({
        title: 'Google Sign-In Error',
        message: msg,
        type: 'error',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppleLogin = async (): Promise<boolean> => {
    setIsSubmitting(true);
    clearError();
    try {
      await signInWithPopup(auth, appleProvider);
      addNotification({
        title: 'Apple Sign-In Successful',
        message: 'Authenticated via Apple ID.',
        type: 'success',
      });
      return true;
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      addNotification({
        title: 'Apple Sign-In Notice',
        message: msg,
        type: 'info',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (email: string): Promise<boolean> => {
    setIsSubmitting(true);
    clearError();
    try {
      await sendPasswordResetEmail(auth, email);
      addNotification({
        title: 'Reset Link Dispatched',
        message: `Password recovery link sent to ${email}.`,
        type: 'info',
      });
      return true;
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      addNotification({
        title: 'Password Reset Error',
        message: msg,
        type: 'error',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async (): Promise<boolean> => {
    if (!auth.currentUser) {
      setError('No active session found.');
      return false;
    }
    setIsSubmitting(true);
    clearError();
    try {
      await sendEmailVerification(auth.currentUser);
      addNotification({
        title: 'Verification Link Sent',
        message: 'A fresh verification email has been dispatched.',
        type: 'info',
      });
      return true;
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      addNotification({
        title: 'Email Delivery Error',
        message: msg,
        type: 'error',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (displayName: string, photoURL?: string): Promise<boolean> => {
    setIsSubmitting(true);
    clearError();
    try {
      if (auth.currentUser) {
        if (photoURL) {
          localStorage.setItem(`aura_pfp_${auth.currentUser.uid}`, photoURL);
        }
        // Only pass photoURL to Firebase Auth if it's a valid HTTP URL under 2048 chars
        const safePhotoURL = photoURL && photoURL.startsWith('http') && photoURL.length < 2048 ? photoURL : undefined;
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: displayName || undefined,
          photoURL: safePhotoURL,
        });
        await reloadUser();
      } else {
        // Guest mode profile customization
        if (displayName) localStorage.setItem('aura_guest_displayName', displayName);
        if (photoURL) localStorage.setItem('aura_pfp_guest', photoURL);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('aura_profile_updated'));
      }

      addNotification({
        title: 'Profile Updated',
        message: 'Your profile picture and details have been updated.',
        type: 'success',
      });
      return true;
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      addNotification({
        title: 'Profile Update Failed',
        message: msg,
        type: 'error',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await signOut(auth);
      addNotification({
        title: 'Signed Out',
        message: 'Session terminated safely.',
        type: 'info',
      });
      navigateToPage('login');
      return true;
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    loginWithEmail: handleLogin,
    signupWithEmail: handleSignup,
    loginWithGoogle: handleGoogleLogin,
    loginWithApple: handleAppleLogin,
    resetPassword: handlePasswordReset,
    resendVerificationEmail: handleResendVerification,
    updateUserProfile: handleUpdateProfile,
    logout: handleLogout,
  };
}
