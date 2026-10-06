/**
 * @file component.tsx
 * @description Master Aura Desktop AppShell layout orchestrator containing Sidebar, TopNavigation, Workspace, ContentContainer, Dock, Footer, and Command Palette modal.
 * @module AuraShell/AppShell/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Sidebar } from '../sidebar';
import { TopNavigation } from '../top-navigation';
import { Workspace } from '../workspace';
import { ContentContainer } from '../content-container';
import { Dock } from '../dock';
import { Footer } from '../footer';
import { Sheet } from '@/components/ui/sheet';
import { CommandPalette } from '@/components/composite/command-palette';
import { useCommandPaletteStore } from '@/stores/useCommandPaletteStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useTheme } from '@/hooks/use-theme';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { AppShellProps } from './types';
import { LayoutDashboard, FolderTree, Activity, Layers, Sparkles, Settings, Bell, Moon, Sun } from 'lucide-react';

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeSectionId,
  onSelectSectionId,
  sidebarGroups,
  breadcrumbs,
  title = 'Aura Core',
  showDock = true,
  showFooter = true,
  showWindowSafeSpacing = false,
  secondaryPaneContent,
  topNavRightActions,
  className,
}) => {
  const { isOpen: isCmdOpen, closeCommandPalette, toggleCommandPalette } = useCommandPaletteStore();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { toggleTheme } = useTheme();

  // Keyboard hotkeys registration
  useKeyboardShortcut('meta+k', () => toggleCommandPalette());
  useKeyboardShortcut('meta+b', () => toggleSidebar());
  useKeyboardShortcut('meta+j', () => toggleTheme());

  // Command palette system actions
  const commandActions = [
    {
      id: 'cmd-dashboard',
      label: 'Go to System Inspector',
      description: 'View foundation diagnostic logs and metrics',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4" />,
      shortcut: ['⌘', '1'],
      onSelect: () => onSelectSectionId?.('aura-core-status'),
    },
    {
      id: 'cmd-components',
      label: 'View Primitive Components',
      description: 'Explore UI primitives and composite components',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4" />,
      onSelect: () => onSelectSectionId?.('components'),
    },
    {
      id: 'cmd-tokens',
      label: 'View Design Tokens',
      description: 'Inspect monochrome palette and motion presets',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4" />,
      onSelect: () => onSelectSectionId?.('tokens'),
    },
    {
      id: 'cmd-theme',
      label: 'Toggle Theme',
      description: 'Switch between light and dark themes',
      category: 'System',
      icon: <Moon className="w-4 h-4 text-amber-400" />,
      shortcut: ['⌘', 'J'],
      onSelect: () => toggleTheme(),
    },
    {
      id: 'cmd-sidebar',
      label: 'Toggle Sidebar',
      description: 'Expand or collapse navigation sidebar',
      category: 'System',
      icon: <FolderTree className="w-4 h-4" />,
      shortcut: ['⌘', 'B'],
      onSelect: () => toggleSidebar(),
    },
  ];

  return (
    <div
      className={cn(
        'w-screen h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans flex flex-col overflow-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black',
        className
      )}
    >
      {/* Top Main Desktop App Row (Sidebar + Right Workspace) */}
      <div className="flex-1 flex w-full h-full min-h-0 overflow-hidden">
        {/* Left Desktop Sidebar */}
        <div className="hidden md:flex h-full">
          <Sidebar
            groups={sidebarGroups}
            activeItemId={activeSectionId}
            onSelectItemId={onSelectSectionId}
          />
        </div>

        {/* Mobile Sidebar Drawer */}
        <div className="md:hidden">
          <Sheet
            isOpen={!isCollapsed}
            onClose={() => toggleSidebar()}
            side="left"
            className="w-72 p-0"
          >
            <Sidebar
              groups={sidebarGroups}
              activeItemId={activeSectionId}
              onSelectItemId={(id) => {
                onSelectSectionId?.(id);
                toggleSidebar();
              }}
              isCollapsed={false}
              resizable={false}
              className="w-full h-full border-r-0"
            />
          </Sheet>
        </div>

        {/* Right Main Body Canvas */}
        <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 bg-[var(--color-bg)] overflow-hidden">
          {/* Top Navigation */}
          <TopNavigation
            title={title}
            breadcrumbs={breadcrumbs}
            showWindowSafeSpacing={showWindowSafeSpacing}
            rightActions={topNavRightActions}
          />

          {/* Workspace Area */}
          <Workspace
            activeWorkspaceId={activeSectionId}
            secondaryPaneContent={secondaryPaneContent}
          >
            <ContentContainer viewKey={activeSectionId}>
              {children}
            </ContentContainer>
          </Workspace>
        </div>
      </div>

      {/* Floating Bottom Dock */}
      {showDock && (
        <Dock
          activeItemId={activeSectionId}
          onSelectItemId={onSelectSectionId}
        />
      )}

      {/* Desktop Footer Status Bar */}
      {showFooter && <Footer workspaceLabel={`Aura OS / ${title}`} />}

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={closeCommandPalette}
        actions={commandActions}
      />
    </div>
  );
};
