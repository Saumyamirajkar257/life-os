/**
 * Overall Cloud Infrastructure Master Store (Zustand)
 */

import { create } from 'zustand';
import { CloudDeviceInfo, StorageUsageBreakdown, FirebaseServicesStatus } from '../types/cloudTypes';
import { DeviceService } from '../services/deviceService';
import { FirebaseService } from '../services/firebaseService';

interface CloudStoreState {
  devices: CloudDeviceInfo[];
  servicesStatus: FirebaseServicesStatus;
  e2eEncryptionEnabled: boolean;

  // Actions
  refreshDevices: () => void;
  revokeDevice: (deviceId: string) => void;
  setE2EEncryptionEnabled: (enabled: boolean) => void;
  calculateStorageUsage: (data: Record<string, any>) => StorageUsageBreakdown;
}

export const useCloudStore = create<CloudStoreState>((set) => ({
  devices: DeviceService.getRegisteredDevices(),
  servicesStatus: FirebaseService.getServicesStatus(),
  e2eEncryptionEnabled: false,

  refreshDevices: () => {
    set({ devices: DeviceService.getRegisteredDevices() });
  },

  revokeDevice: (deviceId) => {
    const updated = DeviceService.revokeDevice(deviceId);
    set({ devices: updated });
  },

  setE2EEncryptionEnabled: (e2eEncryptionEnabled) => set({ e2eEncryptionEnabled }),

  calculateStorageUsage: (data) => {
    let totalBytes = 0;
    const byDomain: StorageUsageBreakdown['byDomain'] = [];

    const domainMeta: Record<string, { label: string; color: string }> = {
      tasks: { label: 'Tasks & Productivity', color: '#3B82F6' },
      habits: { label: 'Habits & Routines', color: '#10B981' },
      goals: { label: 'Goals & Projects', color: '#F59E0B' },
      events: { label: 'Calendar Events', color: '#8B5CF6' },
      journals: { label: 'Journal & Notes', color: '#EC4899' },
      transactions: { label: 'Finance OS', color: '#10B981' },
      ai: { label: 'AI Memory & Chats', color: '#06B6D4' },
    };

    Object.keys(domainMeta).forEach((dom) => {
      const items = data[dom] || [];
      const json = JSON.stringify(items);
      const bytes = new Blob([json]).size;
      totalBytes += bytes;
      byDomain.push({
        domain: dom,
        label: domainMeta[dom].label,
        bytes,
        count: Array.isArray(items) ? items.length : 0,
        color: domainMeta[dom].color,
      });
    });

    return {
      totalBytesUsed: totalBytes + 1048576, // Include 1MB overhead for index metadata
      quotaBytes: 10737418240, // 10 GB
      byDomain,
    };
  },
}));
