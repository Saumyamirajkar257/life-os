/**
 * @file component.tsx
 * @description Composite UserMenu providing compact user status identity with popover actions.
 * @module AuraComposite/UserMenu/Component
 */

import React from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dropdown } from '@/components/ui/dropdown';
import { UserMenuProps } from './types';

export const UserMenu: React.FC<UserMenuProps> = ({
  name,
  email,
  avatarUrl,
  status = 'online',
  badge,
  isCollapsed = false,
  onClick,
  actions = [],
  className,
}) => {
  const cardTrigger = (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-center justify-between p-2 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-all cursor-pointer shadow-2xs',
        isCollapsed ? 'w-10 h-10 p-0 justify-center' : 'w-full',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar src={avatarUrl} name={name} size="sm" status={status} />
        {!isCollapsed && (
          <div className="flex flex-col text-left min-w-0 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">{name}</span>
              {badge && (
                <Badge variant="accent" size="sm">
                  {badge}
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)] truncate">{email}</span>
          </div>
        )}
      </div>

      {!isCollapsed && actions.length > 0 && (
        <MoreVertical className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors shrink-0" />
      )}
    </div>
  );

  if (actions.length === 0) {
    return cardTrigger;
  }

  return (
    <Dropdown
      trigger={cardTrigger}
      align="right"
      items={actions.map((act, idx) => ({
        id: String(idx),
        label: act.label,
        icon: act.icon,
        isDanger: act.isDanger,
        onClick: act.onClick,
      }))}
    />
  );
};
