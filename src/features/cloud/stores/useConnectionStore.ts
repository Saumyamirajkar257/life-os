/**
 * Connection State Store (Zustand)
 */

import { create } from 'zustand';
import { ConnectionState } from '../offline/connectionMonitor';
import { ConnectionMonitor } from '../offline/connectionMonitor';

interface ConnectionStoreState {
  state: ConnectionState;
  initListener: () => void;
}

export const useConnectionStore = create<ConnectionStoreState>((set) => ({
  state: ConnectionMonitor.getState(),

  initListener: () => {
    ConnectionMonitor.init();
    ConnectionMonitor.subscribe((state) => set({ state }));
  },
}));
