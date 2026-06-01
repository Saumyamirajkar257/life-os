import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type AppState } from '@/types';
import { createFirestoreStorage } from '@/lib/firestoreStorage';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activePage: 'dashboard',
      sidebarExpanded: true,
      commandPaletteOpen: false,
      isMobile: false,
      isTablet: false,
      compactDock: false,
      soundEnabled: true,
      userName: 'Saumya',
      userEmail: 'saumya@lifeos.ai',
      userHandle: '@Sam_257',
      userPfp: '',
      setActivePage: (page) => set({ activePage: page }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setMobile: (mobile) => set({ isMobile: mobile }),
      setTablet: (tablet) => set({ isTablet: tablet }),
      setCompactDock: (compact) => set({ compactDock: compact }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      updateProfile: (name, email, handle, pfp) => {
        set((state) => {
          const updatedPfp = pfp !== undefined ? pfp : state.userPfp;
          
          // Write to Firestore users/{userId}/profile/info in the background
          const user = auth.currentUser;
          if (user) {
            const profileRef = doc(db, 'users', user.uid, 'profile', 'info');
            setDoc(profileRef, {
              displayName: name,
              email: email,
              handle: handle,
              photoURL: updatedPfp,
              updatedAt: new Date().toISOString()
            }, { merge: true }).catch((err) => {
              console.error('Failed to sync profile change to Firestore:', err);
            });
          }
          
          return {
            userName: name,
            userEmail: email,
            userHandle: handle,
            userPfp: updatedPfp,
          };
        });
      },
    }),
    {
      name: 'life-os-app-settings',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
