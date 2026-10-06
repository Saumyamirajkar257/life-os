/**
 * @file NotificationCenterDrawer.tsx
 * @description Notification Center slide-over drawer with filtering, grouping by severity/category, dismissal, unread counts, and action buttons.
 * @module Features/Productivity/Components/NotificationCenter/NotificationCenterDrawer
 */

import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Loader2,
  CheckCheck,
  Trash2,
  Filter,
} from 'lucide-react';
import { useProductivityStore } from '../../stores/useProductivityStore';
import { NotificationType, SystemNotification } from '../../types';

export const NotificationCenterDrawer: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setNotificationCenterOpen,
    notifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
  } = useProductivityStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | NotificationType>('all');

  if (!isNotificationCenterOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'loading':
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={() => setNotificationCenterOpen(false)}
      id="notification-drawer-backdrop"
    >
      <div
        className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col text-neutral-200 shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
        id="notification-drawer-container"
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-800 text-neutral-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                Notification Center
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-mono font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-400">System alerts & module updates</p>
            </div>
          </div>

          <button
            onClick={() => setNotificationCenterOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800"
            id="notification-drawer-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-3 border-b border-neutral-800/80 bg-neutral-900/90 flex items-center justify-between text-xs overflow-x-auto gap-2">
          <div className="flex items-center gap-1 shrink-0">
            {(['all', 'unread', 'success', 'warning', 'error', 'info'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="p-1.5 text-neutral-400 hover:text-emerald-400 rounded-md hover:bg-neutral-800"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => clearAllNotifications()}
                className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-md hover:bg-neutral-800"
                title="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="py-20 text-center text-neutral-500 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-neutral-700 opacity-60" />
              <p className="text-sm">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3.5 rounded-xl border transition-all duration-150 space-y-2 relative ${
                  !n.read
                    ? 'bg-neutral-800/60 border-neutral-700/80 text-neutral-100 shadow-sm'
                    : 'bg-neutral-900/40 border-neutral-800/60 text-neutral-400 opacity-80'
                }`}
                id={`notification-item-${n.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 shrink-0">{getIconForType(n.type)}</div>
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-100 flex items-center gap-2">
                        {n.title}
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        )}
                      </h4>
                      <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(n.id);
                    }}
                    className="text-neutral-500 hover:text-neutral-300 p-1 rounded-md hover:bg-neutral-800 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Optional Action Buttons */}
                {n.actionButtons && n.actionButtons.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    {n.actionButtons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          btn.action();
                        }}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 font-mono">
                  <span>{n.category}</span>
                  <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/60 text-center text-xs text-neutral-500">
          Aura Notification Center
        </div>
      </div>
    </div>
  );
};
