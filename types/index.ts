import { type LucideIcon } from 'lucide-react';

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
}

export interface Widget {
  id: string;
  title: string;
  type: 'greeting' | 'ai-insight' | 'focus-score' | 'mission' | 'habits' | 'productivity' | 'sleep';
  layout: LayoutItem;
}

export interface DashboardConfig {
  layouts: LayoutItem[];
  widgets: Widget[];
}

export interface CommandItem {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
  shortcut?: string;
  category: 'navigation' | 'action' | 'create';
  keywords?: string[];
}

export interface AppState {
  activePage: string;
  sidebarExpanded: boolean;
  commandPaletteOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  compactDock: boolean;
  soundEnabled: boolean;
  userName: string;
  userEmail: string;
  userHandle: string;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setMobile: (mobile: boolean) => void;
  setTablet: (tablet: boolean) => void;
  setCompactDock: (compact: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  updateProfile: (name: string, email: string, handle: string) => void;
}

export interface DashboardState {
  layouts: LayoutItem[];
  updateLayout: (layouts: LayoutItem[]) => void;
}

