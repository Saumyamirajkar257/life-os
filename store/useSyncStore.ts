import { create } from 'zustand';

export type SyncStatus = 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncState {
  status: SyncStatus;
  loadedSections: {
    tasks: boolean;
    habits: boolean;
    journal: boolean;
    finance: boolean;
    profile: boolean;
  };
  setStatus: (status: SyncStatus) => void;
  setSectionLoaded: (section: keyof SyncState['loadedSections'], loaded: boolean) => void;
  reset: () => void;
}

const initialLoadedSections = {
  tasks: false,
  habits: false,
  journal: false,
  finance: false,
  profile: false,
};

export const useSyncStore = create<SyncState>((set) => ({
  status: 'synced',
  loadedSections: initialLoadedSections,
  setStatus: (status) => set({ status }),
  setSectionLoaded: (section, loaded) =>
    set((state) => ({
      loadedSections: {
        ...state.loadedSections,
        [section]: loaded,
      },
    })),
  reset: () => set({ status: 'synced', loadedSections: initialLoadedSections }),
}));
