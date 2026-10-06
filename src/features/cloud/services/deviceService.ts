/**
 * Multi-Device Management Service
 */

import { CloudDeviceInfo } from '../types/cloudTypes';

const DEVICES_KEY = 'aura_registered_devices';

export class DeviceService {
  public static getCurrentDevice(): CloudDeviceInfo {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let platform: CloudDeviceInfo['platform'] = 'web';
    if (userAgent.includes('Win')) platform = 'windows';
    else if (userAgent.includes('Mac')) platform = 'macOS';
    else if (userAgent.includes('Android')) platform = 'android';
    else if (userAgent.includes('iPhone')) platform = 'iOS';
    else if (userAgent.includes('iPad')) platform = 'iPad';

    return {
      id: 'dev_current_web_01',
      name: `Aura Desktop (${platform.toUpperCase()})`,
      platform,
      browser: typeof navigator !== 'undefined' ? navigator.vendor || 'Chrome/Edge' : 'Browser',
      ipAddress: '192.168.1.102',
      lastActive: new Date().toISOString(),
      isCurrentDevice: true,
      syncStatus: 'synced',
      appVersion: '2.1.0',
    };
  }

  public static getRegisteredDevices(): CloudDeviceInfo[] {
    const current = this.getCurrentDevice();
    const mockOthers: CloudDeviceInfo[] = [
      {
        id: 'dev_macbook_pro',
        name: 'MacBook Pro 16" (Studio)',
        platform: 'macOS',
        browser: 'Aura Desktop Engine',
        ipAddress: '192.168.1.115',
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        isCurrentDevice: false,
        syncStatus: 'synced',
        appVersion: '2.1.0',
      },
      {
        id: 'dev_iphone_15_pro',
        name: 'iPhone 15 Pro Max',
        platform: 'iOS',
        browser: 'Aura Mobile Companion',
        ipAddress: '10.0.0.45',
        lastActive: new Date(Date.now() - 86400000).toISOString(),
        isCurrentDevice: false,
        syncStatus: 'synced',
        appVersion: '2.0.8',
      },
      {
        id: 'dev_ipad_m2',
        name: 'iPad Pro 12.9" M2',
        platform: 'iPad',
        browser: 'Safari Mobile',
        ipAddress: '10.0.0.88',
        lastActive: new Date(Date.now() - 172800000).toISOString(),
        isCurrentDevice: false,
        syncStatus: 'pending',
        appVersion: '2.0.5',
      },
    ];

    try {
      const raw = localStorage.getItem(DEVICES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CloudDeviceInfo[];
        return [current, ...parsed.filter((d) => d.id !== current.id)];
      }
    } catch {}

    return [current, ...mockOthers];
  }

  public static revokeDevice(deviceId: string): CloudDeviceInfo[] {
    const devices = this.getRegisteredDevices().filter((d) => d.id !== deviceId);
    localStorage.setItem(DEVICES_KEY, JSON.stringify(devices.filter((d) => !d.isCurrentDevice)));
    return devices;
  }
}
