/**
 * @file component.tsx
 * @description Accessible token-driven Data Table component with column sorting and selection.
 * @module AuraUI/Table/Component
 */

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Checkbox } from '../checkbox';
import { Skeleton } from '../skeleton';
import { TableProps } from './types';

export function Table<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyState,
  sortColumn,
  sortDirection,
  onSort,
  selectedKeys = [],
  onSelectionChange,
  isStickyHeader = false,
  className,
}: TableProps<T>) {
  const isSelectable = Boolean(onSelectionChange);
  const allKeys = data.map(keyExtractor);
  const isAllSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeys.includes(k));
  const isSomeSelected = selectedKeys.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(allKeys);
    }
  };

  const handleSelectRow = (key: string) => {
    if (selectedKeys.includes(key)) {
      onSelectionChange?.(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange?.([...selectedKeys, key]);
    }
  };

  return (
    <div className={cn('w-full border border-[var(--color-border)] rounded-2xl overflow-hidden bg-[var(--color-surface)] shadow-2xs', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Header */}
          <thead
            className={cn(
              'bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-mono uppercase tracking-wider',
              isStickyHeader && 'sticky top-0 z-10'
            )}
          >
            <tr>
              {isSelectable && (
                <th className="p-3.5 pl-4 w-10">
                  <Checkbox
                    checked={isAllSelected}
                    isIndeterminate={isSomeSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className="p-3.5 px-4 font-semibold text-[var(--color-text-primary)]"
                >
                  {col.isSortable ? (
                    <button
                      type="button"
                      onClick={() => onSort?.(col.key)}
                      className="inline-flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors focus:outline-none cursor-pointer"
                    >
                      <span>{col.header}</span>
                      {sortColumn === col.key ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    <span>{col.header}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[var(--color-border-subtle)] text-[var(--color-text-primary)]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (isSelectable ? 1 : 0)} className="p-6">
                  <Skeleton variant="table" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (isSelectable ? 1 : 0)}
                  className="p-8 text-center text-[var(--color-text-muted)]"
                >
                  {emptyState || 'No records available'}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const key = keyExtractor(item);
                const isSelected = selectedKeys.includes(key);

                return (
                  <tr
                    key={key}
                    className={cn(
                      'transition-colors hover:bg-[var(--color-surface-elevated)]/60',
                      isSelected && 'bg-[var(--color-accent-muted)]/40'
                    )}
                  >
                    {isSelectable && (
                      <td className="p-3.5 pl-4 w-10">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectRow(key)}
                          aria-label={`Select row ${key}`}
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td key={col.key} className="p-3.5 px-4 font-normal">
                        {col.cell(item)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
