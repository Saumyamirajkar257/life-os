/**
 * @file component.tsx
 * @description Premium resizable, collapsible, pinned Desktop Sidebar navigation with groups, active indicator, tooltips, and keyboard navigation.
 * @module AuraShell/Sidebar/Component
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  PinOff,
  ChevronDown,
  ChevronRight,
  Layers,
  LayoutDashboard,
  Cpu,
  Settings,
  Sparkles,
  Activity,
  FolderTree,
  Bell,
  Zap,
  UserCheck,
  ShieldCheck,
  CheckSquare,
  Flame,
  Target,
  Calendar,
  BookOpen,
  Wallet,
  BarChart3,
  Cloud,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { Tooltip } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/config/app.config';
import { springTransitions } from '@/animations/transitions';
import { preloadRoute } from '@/lib/router/prefetch';
import { SidebarProps, SidebarGroup, SidebarItem } from './types';

const DEFAULT_GROUPS: SidebarGroup[] = [
  {
    id: 'home',
    title: 'HOME',
    items: [
      { id: 'analytics', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, shortcut: '⌘H' },
    ],
  },
  {
    id: 'plan',
    title: 'PLAN',
    items: [
      { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
      { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
      { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> },
    ],
  },
  {
    id: 'grow',
    title: 'GROW',
    items: [
      { id: 'habits', label: 'Habits', icon: <Flame className="w-4 h-4" /> },
      { id: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    ],
  },
  {
    id: 'life',
    title: 'LIFE',
    items: [
      { id: 'finance', label: 'Finance', icon: <Wallet className="w-4 h-4" /> },
    ],
  },
  {
    id: 'intelligence',
    title: 'INTELLIGENCE',
    items: [
      { id: 'ai', label: 'Aura AI', icon: <Sparkles className="w-4 h-4" /> },
    ],
  },
  {
    id: 'system',
    title: 'SYSTEM',
    collapsible: true,
    defaultExpanded: true,
    items: [
      { id: 'user-profile', label: 'Profile', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'cloud', label: 'Cloud', icon: <Cloud className="w-4 h-4" /> },
      { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  groups = DEFAULT_GROUPS,
  activeItemId: customActiveItemId,
  onSelectItemId,
  isCollapsed: customIsCollapsed,
  onToggleCollapse,
  isPinned: customIsPinned = false,
  onTogglePin,
  resizable = true,
  defaultWidth = 260,
  minWidth = 200,
  maxWidth = 380,
  headerContent,
  footerContent,
  className,
}) => {
  const { isCollapsed: storeIsCollapsed, activeSectionId: storeActiveId, toggleSidebar, setActiveSection } =
    useSidebarStore();

  const isCollapsed = customIsCollapsed !== undefined ? customIsCollapsed : storeIsCollapsed;
  const activeItemId = customActiveItemId !== undefined ? customActiveItemId : (storeActiveId || groups[0]?.items[0]?.id);

  const [isPinned, setIsPinned] = useState(customIsPinned);
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // Keyboard shortcut ⌘B to toggle sidebar
  useKeyboardShortcut('meta+b', () => {
    if (onToggleCollapse) onToggleCollapse();
    else toggleSidebar();
  });

  // Handle Resize Dragging
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  const handleItemClick = (item: SidebarItem) => {
    if (item.disabled) return;
    if (onSelectItemId) {
      onSelectItemId(item.id);
    } else {
      setActiveSection(item.id);
    }
    if (item.onClick) item.onClick();
  };

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const toggleCollapseState = () => {
    if (onToggleCollapse) onToggleCollapse();
    else toggleSidebar();
  };

  const togglePinState = () => {
    setIsPinned(!isPinned);
    if (onTogglePin) onTogglePin();
  };

  // Keyboard accessibility inside sidebar list
  const handleKeyDown = (e: React.KeyboardEvent, item: SidebarItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  const effectiveWidth = isCollapsed ? 64 : width;

  return (
    <motion.aside
      ref={sidebarRef}
      initial={false}
      animate={{ width: effectiveWidth }}
      transition={springTransitions.gentle}
      className={cn(
        'relative h-full bg-[var(--color-bg)] flex flex-col justify-between shrink-0 select-none z-20 group/sidebar',
        // Make sidebar a floating slab with spatial classes
        'border-r border-[var(--color-border)]/10 shadow-[var(--spatial-shadow-elevated)] transition-shadow duration-500',
        isResizing ? 'cursor-col-resize select-none border-r-[var(--color-accent)]' : '',
        className
      )}
      style={{ width: effectiveWidth, clipPath: 'inset(0 -20px 0 0)' /* allows shadow to right */ }}
    >
      {/* Resizable Drag Handle */}
      {resizable && !isCollapsed && (
        <div
          onMouseDown={startResizing}
          title="Drag to resize sidebar"
          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[var(--color-accent)]/40 transition-colors z-30 opacity-0 group-hover/sidebar:opacity-100"
        />
      )}

      {/* Header / Brand */}
      <div className="h-14 px-4 flex items-center justify-between gap-2 shrink-0 bg-transparent">
        {headerContent ? (
          headerContent
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col min-w-0"
              >
                <span className="font-bold tracking-tight text-sm text-[var(--color-text-primary)] truncate font-sans">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-mono truncate">
                  Desktop OS Shell
                </span>
              </motion.div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1">
          {!isCollapsed && (
            <Tooltip content={isPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}>
              <button
                type="button"
                onClick={togglePinState}
                className={cn(
                  'p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer',
                  isPinned ? 'text-[var(--color-accent)] bg-[var(--color-accent-muted)]' : ''
                )}
              >
                {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
              </button>
            </Tooltip>
          )}

          <Tooltip content={isCollapsed ? 'Expand Sidebar (⌘B)' : 'Collapse Sidebar (⌘B)'}>
            <button
              type="button"
              onClick={toggleCollapseState}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Navigation Group Items List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {groups.map((group) => {
          const isGroupCollapsed = collapsedGroups[group.id];

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Title Header */}
              {group.title && !isCollapsed && (
                <div
                  onClick={() => group.collapsible && toggleGroupCollapse(group.id)}
                  className={cn(
                    'px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] font-bold flex items-center justify-between select-none',
                    group.collapsible ? 'cursor-pointer hover:text-[var(--color-text-primary)]' : ''
                  )}
                >
                  <span className="truncate">{group.title}</span>
                  {group.collapsible && (
                    <span className="shrink-0 text-[var(--color-text-muted)]">
                      {isGroupCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </span>
                  )}
                </div>
              )}

              {/* Items */}
              {!isGroupCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeItemId === item.id;

                    const itemContent = (
                      <motion.button
                        ref={isActive ? activeItemRef : undefined}
                        type="button"
                        onClick={() => handleItemClick(item)}
                        onMouseEnter={() => preloadRoute(item.id)}
                        onFocus={() => preloadRoute(item.id)}
                        onPointerDown={() => preloadRoute(item.id)}
                        onKeyDown={(e) => handleKeyDown(e, item)}
                        disabled={item.disabled}
                        tabIndex={0}
                        aria-current={isActive ? 'page' : undefined}
                        whileHover={!item.disabled ? { scale: 1.015, z: 2, y: -1 } : {}}
                        whileTap={!item.disabled ? { scale: 0.98, z: 0, y: 0 } : {}}
                        className={cn(
                          'group/item relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed select-none transform-gpu',
                          isActive
                            ? 'text-[var(--color-accent)] font-bold'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] hover:shadow-[var(--spatial-shadow-ambient)]',
                          isCollapsed ? 'justify-center px-0' : ''
                        )}
                      >
                        {/* Active Indicator Background Animation */}
                        {isActive && (
                          <motion.div
                            layoutId="active-sidebar-pill"
                            className="absolute inset-0 bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 rounded-xl"
                            transition={springTransitions.snappy}
                          />
                        )}

                        <span
                          className={cn(
                            'relative z-10 shrink-0 transition-transform group-hover/item:scale-110',
                            isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] group-hover/item:text-[var(--color-text-primary)]'
                          )}
                        >
                          {item.icon}
                        </span>

                        {!isCollapsed && (
                          <div className="relative z-10 flex-1 flex items-center justify-between min-w-0">
                            <span className="truncate">{item.label}</span>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {item.badge !== undefined && (
                                <Badge
                                  variant={item.badgeVariant || (isActive ? 'accent' : 'outline')}
                                  size="sm"
                                >
                                  {item.badge}
                                </Badge>
                              )}

                              {item.shortcut && (
                                <span className="text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                                  {item.shortcut}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.button>
                    );

                    return isCollapsed ? (
                      <Tooltip key={item.id} content={item.label} position="right">
                        <div>{itemContent}</div>
                      </Tooltip>
                    ) : (
                      <React.Fragment key={item.id}>{itemContent}</React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer / Status Area */}
      <div className="p-3 bg-transparent shrink-0">
        {footerContent ? (
          footerContent
        ) : (
          <div className="flex items-center justify-between gap-2">
            {!isCollapsed ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[11px] font-mono text-[var(--color-text-muted)] truncate">
                  Aura Core Active
                </span>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500" title="System Active" />
              </div>
            )}

            {!isCollapsed && (
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] px-1.5 py-0.5 rounded bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
                {APP_CONFIG.version}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
};
