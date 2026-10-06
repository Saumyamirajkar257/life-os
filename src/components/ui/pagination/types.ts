/**
 * @file types.ts
 * @description Type definitions for Aura UI Pagination component.
 * @module AuraUI/Pagination/Types
 */

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
  className?: string;
}
