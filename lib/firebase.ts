import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "life-os-app-2026",
  appId: "1:531059756717:web:8f5695382e72a6ce180024",
  storageBucket: "life-os-app-2026.firebasestorage.app",
  apiKey: "AIzaSyCcNv873lNfULk0noSXn-MC1E1BhBc6y-0",
  authDomain: "life-os-app-2026.firebaseapp.com",
  messagingSenderId: "531059756717",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
