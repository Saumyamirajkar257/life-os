import type { LucideIcon } from 'lucide-react';
import type { NavItem } from './navigation';

export interface AuraModuleRoute {
  path: string;
  label: string;
}

export interface AuraModuleCommand {
  id: string;
  label: string;
  icon?: LucideIcon;
  shortcut?: string[];
  action: () => void;
}

export interface AuraModule {
  id: string;
  name: string;
  description?: string;
  icon: LucideIcon;
  version: string;
  routes: AuraModuleRoute[];
  navItems: NavItem[];
  commands?: AuraModuleCommand[];
}
