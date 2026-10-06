/**
 * @file config.ts
 * @description Real Firebase SDK initialization using firebase-applet-config.json and ENV fallback.
 * @module AuraCore/Lib/Firebase/Config
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import firebaseAppletConfig from '../../../firebase-applet-config.json';
import { ENV } from '@/config/env.config';

const config = {
  apiKey: firebaseAppletConfig?.apiKey || ENV.VITE_FIREBASE_API_KEY,
  authDomain: firebaseAppletConfig?.authDomain || ENV.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseAppletConfig?.projectId || ENV.VITE_FIREBASE_PROJECT_ID,
  storageBucket: firebaseAppletConfig?.storageBucket || ENV.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseAppletConfig?.messagingSenderId || ENV.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseAppletConfig?.appId || ENV.VITE_FIREBASE_APP_ID,
};

export const app: FirebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
