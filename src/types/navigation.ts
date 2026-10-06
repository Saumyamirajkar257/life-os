import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number | string;
  children?: NavItem[];
  external?: boolean;
  disabled?: boolean;
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}
