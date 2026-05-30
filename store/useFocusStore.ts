import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export interface BlockedSite {
  id: string;
  name: string;
  domain: string;
  blocked: boolean;
  dailyLimit: number;
  currentUsage: number;
  icon: string;
}

export interface RoomMember {
  uid: string;
  name: string;
  status: 'active' | 'distracted';
}

interface FocusState {
  strictMode: boolean;
  calendarSynced: boolean;
  blockedSites: BlockedSite[];
  
  // Multiplayer parameters
  currentRoomId: string | null;
  roomMembers: RoomMember[];
  timerStatus: 'idle' | 'running' | 'paused';
  startedAt: string | null;
  durationSeconds: number;

  setStrictMode: (enabled: boolean) => void;
  setCalendarSynced: (synced: boolean) => void;
  toggleBlockSite: (id: string) => void;
  updateSiteLimit: (id: string, limit: number) => void;
  setRoomState: (updates: Partial<Pick<FocusState, 'currentRoomId' | 'roomMembers' | 'timerStatus' | 'startedAt' | 'durationSeconds'>>) => void;
}

const initialBlockedSites: BlockedSite[] = [
  { id: 'youtube', name: 'YouTube', domain: 'youtube.com', blocked: true, dailyLimit: 60, currentUsage: 45, icon: '📺' },
  { id: 'twitter', name: 'Twitter / X', domain: 'x.com', blocked: true, dailyLimit: 15, currentUsage: 32, icon: '🐦' },
  { id: 'instagram', name: 'Instagram', domain: 'instagram.com', blocked: false, dailyLimit: 20, currentUsage: 22, icon: '📸' },
  { id: 'discord', name: 'Discord', domain: 'discord.com', blocked: true, dailyLimit: 45, currentUsage: 15, icon: '💬' },
  { id: 'reddit', name: 'Reddit', domain: 'reddit.com', blocked: false, dailyLimit: 25, currentUsage: 8, icon: '👽' }
];

export const useFocusStore = create<FocusState>()(
  persist(
    (set) => ({
      strictMode: true,
      calendarSynced: false,
      blockedSites: initialBlockedSites,
      
      // Multiplayer defaults
      currentRoomId: null,
      roomMembers: [],
      timerStatus: 'idle',
      startedAt: null,
      durationSeconds: 1500,

      setStrictMode: (enabled) => set({ strictMode: enabled }),
      setCalendarSynced: (synced) => set({ calendarSynced: synced }),
      toggleBlockSite: (id) =>
        set((state) => ({
          blockedSites: state.blockedSites.map((site) =>
            site.id === id ? { ...site, blocked: !site.blocked } : site
          ),
        })),
      updateSiteLimit: (id, limit) =>
        set((state) => ({
          blockedSites: state.blockedSites.map((site) =>
            site.id === id ? { ...site, dailyLimit: Math.max(5, limit) } : site
          ),
        })),
      setRoomState: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'life-os-focus',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
