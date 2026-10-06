/**
 * @file component.tsx
 * @description Accessible token-driven Pagination control component.
 * @module AuraUI/Pagination/Component
 */

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '../button';
import { PaginationProps } from './types';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  totalItems,
  className,
}) => {
  const generatePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-4 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-secondary)]', className)}>
      {/* Total items & Page size picker */}
      <div className="flex items-center gap-4">
        {totalItems !== undefined && (
          <span className="font-mono text-[var(--color-text-muted)]">
            Total: <strong className="text-[var(--color-text-primary)]">{totalItems}</strong> items
          </span>
        )}

        {pageSize !== undefined && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-focus-ring)] cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="xs"
          isIconButton
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="outline"
          size="xs"
          isIconButton
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>

        <div className="flex items-center gap-1 mx-1">
          {generatePages().map((page, idx) => {
            if (typeof page === 'string') {
              return (
                <span key={idx} className="px-1.5 text-[var(--color-text-muted)] font-mono">
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <Button
                key={page}
                variant={isCurrent ? 'primary' : 'ghost'}
                size="xs"
                onClick={() => onPageChange(page)}
                className={cn('w-7 h-7 p-0 font-mono', isCurrent && 'font-bold')}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="xs"
          isIconButton
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="outline"
          size="xs"
          isIconButton
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
