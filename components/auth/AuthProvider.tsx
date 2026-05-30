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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const isBypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
      if (user || isBypassed) {
        // User logged in or bypassed, hydrate all stores from Firestore or local storage
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
        const publicPaths = ['/login', '/welcome', '/', '/about', '/contact', '/faq'];
        if (!publicPaths.includes(pathname)) {
          router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-pulse-slow text-white/50 font-display">Initializing Neural Link...</div>
      </div>
    );
  }

  return <>{children}</>;
}
