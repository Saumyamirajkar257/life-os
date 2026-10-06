/**
 * Registered Multi-Device List Widget
 */

import React from 'react';
import { Laptop, Monitor, Smartphone, Tablet, Globe, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCloudStore } from '../stores/useCloudStore';
import { CloudDeviceInfo } from '../types/cloudTypes';

export const DeviceListWidget: React.FC = () => {
  const { devices, revokeDevice } = useCloudStore();

  const getPlatformIcon = (platform: CloudDeviceInfo['platform']) => {
    switch (platform) {
      case 'windows':
        return <Monitor className="w-5 h-5 text-blue-400" />;
      case 'macOS':
        return <Laptop className="w-5 h-5 text-purple-400" />;
      case 'android':
      case 'iOS':
        return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'iPad':
        return <Tablet className="w-5 h-5 text-amber-400" />;
      default:
        return <Globe className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> Active Synchronized Devices
          </h3>
          <p className="text-xs text-slate-400">
            Registered devices connected to your Aura Cloud workspace
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
          {devices.length} Devices Registered
        </span>
      </div>

      <div className="space-y-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
              device.isCurrentDevice
                ? 'bg-teal-500/5 border-teal-500/30'
                : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60">
                {getPlatformIcon(device.platform)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">{device.name}</span>
                  {device.isCurrentDevice && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-medium border border-teal-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> This Device
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {device.browser} • Last active {new Date(device.lastActive).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {!device.isCurrentDevice && (
              <button
                onClick={() => revokeDevice(device.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Revoke Device Access"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
