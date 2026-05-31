'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useJournalStore } from '@/store/useJournalStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useBrainStore } from '@/store/useBrainStore';
import { useAIStore } from '@/store/useAIStore';
import { useRoutinesStore } from '@/store/useRoutinesStore';
import { useAutomationsStore } from '@/store/useAutomationsStore';
import { useFocusStore } from '@/store/useFocusStore';
import { useFriendsStore } from '@/store/useFriendsStore';
import { useVaultStore } from '@/store/useVaultStore';
import { useAchievementsStore } from '@/store/useAchievementsStore';
import { useAppStore } from '@/store/useAppStore';
import { migrateLocalDataToFirestore, startRealtimeSync, stopRealtimeSync } from '@/lib/firestoreSync';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const isBypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
      if (user || isBypassed) {
        if (user) {
          // Perform data migration from localStorage to Firestore if there is legacy data
          await migrateLocalDataToFirestore(user.uid);
          // Start Firestore real-time onSnapshot listeners
          startRealtimeSync(user.uid);
        }

        // User logged in or bypassed, hydrate all stores from Firestore or local storage
        useAppStore.persist.rehydrate();
        useTasksStore.persist.rehydrate();
        useHabitsStore.persist.rehydrate();
        useJournalStore.persist.rehydrate();
        useFinanceStore.persist.rehydrate();
        useBrainStore.persist.rehydrate();
        useAIStore.persist.rehydrate();
        useRoutinesStore.persist.rehydrate();
        useAutomationsStore.persist.rehydrate();
        useFocusStore.persist.rehydrate();
        useFriendsStore.persist.rehydrate();
        useVaultStore.persist.rehydrate();
        useAchievementsStore.persist.rehydrate();
        
        if (pathname === '/login' || pathname === '/welcome') {
          router.push('/');
        }
      } else {
        // User logged out
        stopRealtimeSync();
        // Clear all local storage caches for stores to prevent data leaking between accounts
        if (typeof window !== 'undefined') {
          let hasCleared = false;
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('life-os-') && !key.includes('prev-')) {
              localStorage.removeItem(key);
              hasCleared = true;
            }
          });
          
          if (hasCleared) {
            // Force a full page reload to clear Zustand in-memory state and garbage-collect old user data
            window.location.href = '/login';
            return;
          }
        }

        const publicPaths = ['/login', '/welcome', '/', '/about', '/contact', '/faq'];
        if (!publicPaths.includes(pathname)) {
          router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const publicPaths = ['/login', '/welcome', '/', '/about', '/contact', '/faq'];
  const isPublicPath = publicPaths.includes(pathname);

  if (loading && !isPublicPath) {
    return <div className="min-h-screen w-full bg-black" />;
  }

  return <>{children}</>;
}
