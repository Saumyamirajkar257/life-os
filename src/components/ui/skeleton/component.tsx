/**
 * @file component.tsx
 * @description Accessible loading skeleton component with pulse animation and preset structures.
 * @module AuraUI/Skeleton/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { SkeletonProps } from './types';

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className,
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]';

  if (variant === 'card') {
    return (
      <div className={cn('p-5 rounded-2xl border border-[var(--color-border)] space-y-3 bg-[var(--color-surface)]', className)}>
        <div className={cn('h-4 w-1/3 rounded-md', baseClasses)} />
        <div className={cn('h-20 w-full rounded-lg', baseClasses)} />
        <div className="flex gap-2">
          <div className={cn('h-3 w-16 rounded-md', baseClasses)} />
          <div className={cn('h-3 w-12 rounded-md', baseClasses)} />
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4 w-full', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-2xl border border-[var(--color-border)] space-y-2 bg-[var(--color-surface)]">
            <div className={cn('h-3 w-20 rounded', baseClasses)} />
            <div className={cn('h-8 w-28 rounded-md', baseClasses)} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('w-full border border-[var(--color-border)] rounded-xl p-4 space-y-3 bg-[var(--color-surface)]', className)}>
        <div className={cn('h-8 w-full rounded-lg', baseClasses)} />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={cn('h-10 w-full rounded-md', baseClasses)} />
        ))}
      </div>
    );
  }

  const variantShape = {
    text: 'h-3.5 w-full rounded-md',
    circular: 'rounded-full shrink-0',
    rectangular: 'rounded-lg',
  }[variant as 'text' | 'circular' | 'rectangular'];

  const style = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={style}
          className={cn(baseClasses, variantShape, className)}
          aria-hidden="true"
        />
      ))}
    </>
  );
};
