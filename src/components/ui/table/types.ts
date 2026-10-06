/**
 * @file types.ts
 * @description Type definitions for Aura UI Table component.
 * @module AuraUI/Table/Types
 */

import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  isSortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyState?: ReactNode;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  isStickyHeader?: boolean;
  className?: string;
}
