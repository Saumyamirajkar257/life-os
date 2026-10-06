/**
 * @file component.tsx
 * @description Composite Breadcrumbs with auto-overflow popover collapse, route icons, keyboard navigation, and custom separators.
 * @module AuraComposite/Breadcrumbs/Component
 */

import React from 'react';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Dropdown } from '@/components/ui/dropdown';
import { BreadcrumbsProps, BreadcrumbItem } from './types';

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  maxItems = 4,
  separator = <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />,
  showHomeIcon = true,
  onHomeClick,
  className,
}) => {
  const shouldCollapse = items.length > maxItems;

  let visibleItems: BreadcrumbItem[] = items;
  let collapsedItems: BreadcrumbItem[] = [];

  if (shouldCollapse) {
    const head = items.slice(0, 1);
    const tail = items.slice(items.length - (maxItems - 1));
    collapsedItems = items.slice(1, items.length - (maxItems - 1));
    visibleItems = [...head, ...tail];
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]', className)}>
      {showHomeIcon && (
        <>
          <button
            type="button"
            onClick={onHomeClick}
            className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
            aria-label="Navigate home"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
          {items.length > 0 && separator}
        </>
      )}

      {shouldCollapse && (
        <>
          {/* First Item */}
          <BreadcrumbNode item={visibleItems[0]} isCurrent={false} />
          {separator}

          {/* Ellipsis Dropdown for Collapsed Items */}
          <Dropdown
            align="left"
            trigger={
              <button
                type="button"
                className="px-1.5 py-0.5 rounded-md hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                aria-label="Show hidden breadcrumb items"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            }
            items={collapsedItems.map((col) => ({
              id: col.id,
              label: col.label,
              icon: col.icon,
              onClick: col.onClick,
            }))}
          />
          {separator}

          {/* Remaining Visible Items */}
          {visibleItems.slice(1).map((item, idx) => {
            const isLast = idx === visibleItems.slice(1).length - 1;
            return (
              <React.Fragment key={item.id}>
                <BreadcrumbNode item={item} isCurrent={isLast} />
                {!isLast && separator}
              </React.Fragment>
            );
          })}
        </>
      )}

      {!shouldCollapse &&
        items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={item.id}>
              <BreadcrumbNode item={item} isCurrent={isLast} />
              {!isLast && separator}
            </React.Fragment>
          );
        })}
    </nav>
  );
};

const BreadcrumbNode: React.FC<{ item: BreadcrumbItem; isCurrent: boolean }> = ({ item, isCurrent }) => {
  if (isCurrent) {
    return (
      <span
        aria-current="page"
        className="font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 truncate max-w-[160px]"
      >
        {item.icon}
        <span>{item.label}</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:underline flex items-center gap-1.5 transition-colors cursor-pointer truncate max-w-[140px]"
    >
      {item.icon}
      <span>{item.label}</span>
    </button>
  );
};
