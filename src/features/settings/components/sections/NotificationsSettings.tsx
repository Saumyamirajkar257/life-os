/**
 * @file NotificationsSettings.tsx
 * @description Controls for audio volume, alert toasts, email digests, push notifications, and category subscriptions.
 * @module Features/Settings/Components/Sections/NotificationsSettings
 */

import React from 'react';
import { Bell, Volume2, Mail, Smartphone, ShieldAlert, Activity, CheckSquare, Sparkles, VolumeX } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '@/components/ui/button';

export const NotificationsSettings: React.FC = () => {
  const { notifications, updateNotifications, playToggleSound } = useSettings();

  const handleMasterToggle = () => {
    playToggleSound();
    updateNotifications({ masterEnabled: !notifications.masterEnabled });
  };

  const handleTestSound = () => {
    playToggleSound();
  };

  return (
    <div className="space-y-8">
      {/* 1. Master Channel Preferences */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Notification Dispatch System</span>
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Manage system alerts, toast messages, and sound synthesizers.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-lg">
            <span className="text-xs font-mono text-[var(--color-text-secondary)]">Master Switch:</span>
            <button
              type="button"
              onClick={handleMasterToggle}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                notifications.masterEnabled ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.masterEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* In-App Toasts */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-[var(--color-text-primary)]">
                In-App Toast Popups
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Display transient alerts in the bottom-right corner.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateNotifications({ inAppToast: !notifications.inAppToast });
              }}
              disabled={!notifications.masterEnabled}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                notifications.inAppToast && notifications.masterEnabled ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.inAppToast && notifications.masterEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Desktop Push Alerts */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-[var(--color-text-primary)]">
                Browser Push Notifications
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Dispatch native system notifications when app is minimized.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateNotifications({ desktopPush: !notifications.desktopPush });
              }}
              disabled={!notifications.masterEnabled}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                notifications.desktopPush && notifications.masterEnabled ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.desktopPush && notifications.masterEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sound Effects & Volume Controls */}
      <div className="space-y-4 pt-6 border-t border-[var(--color-border)]">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Audio Synthesizer & Sound Effects</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Acoustic feedback for key presses, toggles, and status updates.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notifications.soundEffects ? (
                <Volume2 className="w-5 h-5 text-[var(--color-accent)]" />
              ) : (
                <VolumeX className="w-5 h-5 text-[var(--color-text-muted)]" />
              )}
              <div>
                <div className="text-xs font-medium text-[var(--color-text-primary)]">
                  Enable UI Acoustic Feedback
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)]">
                  Plays WebAudio frequency chimes on interactive events.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateNotifications({ soundEffects: !notifications.soundEffects });
              }}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                notifications.soundEffects ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.soundEffects ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {notifications.soundEffects && (
            <div className="pt-2 border-t border-[var(--color-border)] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--color-text-secondary)]">Volume Level:</span>
                <span className="text-[var(--color-accent)] font-semibold">{notifications.soundVolume}%</span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={notifications.soundVolume}
                  onChange={(e) => updateNotifications({ soundVolume: parseInt(e.target.value) })}
                  className="w-full accent-[var(--color-accent)] cursor-pointer"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleTestSound} className="shrink-0 text-xs font-mono">
                  Test Sound
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Category Subscriptions */}
      <div className="space-y-4 pt-6 border-t border-[var(--color-border)]">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Category Alert Channels</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Filter notification types to avoid notification fatigue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Security Alerts */}
          <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-xs font-medium text-[var(--color-text-primary)]">Security & Auth Alerts</div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">New logins & credential updates.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateNotifications({
                  categories: {
                    ...notifications.categories,
                    securityAlerts: !notifications.categories.securityAlerts,
                  },
                });
              }}
              className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                notifications.categories.securityAlerts ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  notifications.categories.securityAlerts ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* System Health */}
          <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-medium text-[var(--color-text-primary)]">System Diagnostics</div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">Storage limits & memory spikes.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateNotifications({
                  categories: {
                    ...notifications.categories,
                    systemHealth: !notifications.categories.systemHealth,
                  },
                });
              }}
              className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                notifications.categories.systemHealth ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  notifications.categories.systemHealth ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Task Updates */}
          <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-medium text-[var(--color-text-primary)]">Task & Workflow Updates</div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">Completion & assignment notices.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateNotifications({
                  categories: {
                    ...notifications.categories,
                    taskUpdates: !notifications.categories.taskUpdates,
                  },
                });
              }}
              className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                notifications.categories.taskUpdates ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  notifications.categories.taskUpdates ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Announcements */}
          <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-medium text-[var(--color-text-primary)]">Feature Announcements</div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">Milestone release notes & updates.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateNotifications({
                  categories: {
                    ...notifications.categories,
                    announcements: !notifications.categories.announcements,
                  },
                });
              }}
              className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                notifications.categories.announcements ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  notifications.categories.announcements ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
