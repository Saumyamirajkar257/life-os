/**
 * @file component.tsx
 * @description Accessible token-driven Avatar and AvatarGroup component with status indicators.
 * @module AuraUI/Avatar/Component
 */

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AvatarProps, AvatarGroupProps, AvatarSize, AvatarStatus } from './types';

const avatarSizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusSizeClasses: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

const statusBgClasses: Record<AvatarStatus, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  busy: 'bg-rose-500',
  offline: 'bg-gray-400',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  fallbackIcon,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [src]);

  const getInitials = (n?: string) => {
    if (!n) return '';
    const parts = n.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className={cn('relative inline-block shrink-0', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold overflow-hidden select-none',
          avatarSizeClasses[size]
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          fallbackIcon || <User className="w-1/2 h-1/2 text-[var(--color-text-muted)]" />
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--color-bg)]',
            statusSizeClasses[size],
            statusBgClasses[status]
          )}
        />
      )}
    </div>
  );
};

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 4,
  size = 'md',
  className,
}) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const overflowCount = childArray.length - max;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="ring-2 ring-[var(--color-bg)] rounded-full">
          {React.isValidElement<AvatarProps>(child)
            ? React.cloneElement(child, { size: child.props.size || size })
            : child}
        </div>
      ))}

      {overflowCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold text-xs ring-2 ring-[var(--color-bg)] select-none',
            avatarSizeClasses[size]
          )}
        >
          +{overflowCount}
        </div>
      )}
    </div>
  );
};
