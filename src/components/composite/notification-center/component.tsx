/**
 * @file component.tsx
 * @description Composite NotificationCenter component with grouped items, unread badges, skeletons, and batch actions.
 * @module AuraComposite/NotificationCenter/Component
 */

import React, { useMemo } from 'react';
import { Bell, CheckCheck, Trash2, Info, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { NotificationCenterProps, NotificationItem } from './types';

const typeIcons: Record<string, React.ReactNode> = {
  info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  className,
}) => {
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  // Group notifications by category or timeline
  const grouped = useMemo(() => {
    const map: Record<string, NotificationItem[]> = {};
    notifications.forEach((item) => {
      const cat = item.category || 'General Notifications';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });
    return map;
  }, [notifications]);

  return (
    <div className={cn('w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden flex flex-col', className)}>
      {/* Header Bar */}
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-elevated)]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[var(--color-accent)]" />
          <h3 className="text-xs font-bold text-[var(--color-text-primary)]">Notification Center</h3>
          {unreadCount > 0 && (
            <Badge variant="accent" size="sm">
              {unreadCount} New
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button variant="ghost" size="xs" onClick={onMarkAllAsRead} className="gap-1 text-[10px]">
              <CheckCheck className="w-3 h-3" /> Mark read
            </Button>
          )}
          {notifications.length > 0 && onClearAll && (
            <Button variant="ghost" size="xs" onClick={onClearAll} className="gap-1 text-[10px] text-[var(--color-error)]">
              <Trash2 className="w-3 h-3" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto max-h-[420px] p-2 space-y-4">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton variant="rectangular" height={60} count={3} className="rounded-xl" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-6 h-6 text-[var(--color-accent)]" />}
            title="All caught up!"
            description="You have no unread notifications right now."
            className="my-4 border-none bg-transparent shadow-none"
          />
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-1.5">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] font-bold">
                {category}
              </div>

              <div className="space-y-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onMarkAsRead?.(item.id);
                      onNotificationClick?.(item);
                    }}
                    className={cn(
                      'p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative',
                      item.isRead
                        ? 'bg-[var(--color-surface)] border-[var(--color-border-subtle)] opacity-80'
                        : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] shadow-2xs font-medium'
                    )}
                  >
                    {!item.isRead && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                    )}

                    <div className="mt-0.5">{item.icon || typeIcons[item.type || 'info']}</div>

                    <div className="flex-1 min-w-0 space-y-1 pr-4">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-[var(--color-text-primary)] truncate">{item.title}</h5>
                        <span className="text-[10px] font-mono text-[var(--color-text-muted)] shrink-0">{item.time}</span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{item.description}</p>
                      )}

                      {item.action && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            item.action?.onClick();
                          }}
                          className="mt-2 text-[10px]"
                        >
                          {item.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
