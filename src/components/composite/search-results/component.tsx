/**
 * @file component.tsx
 * @description Composite SearchResults presenting filtered query lists grouped by category with skeleton loaders.
 * @module AuraComposite/SearchResults/Component
 */

import React, { useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ListItem } from '../list-item';
import { SearchResultsProps, SearchResultItem } from './types';

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  isLoading = false,
  onClearQuery,
  className,
}) => {
  const grouped = useMemo(() => {
    const map: Record<string, SearchResultItem[]> = {};
    results.forEach((item) => {
      const cat = item.category || 'Results';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });
    return map;
  }, [results]);

  if (isLoading) {
    return (
      <div className={cn('space-y-3 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl', className)}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rectangular" height={50} count={3} className="rounded-xl" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={cn('p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-2', className)}>
        <Search className="w-8 h-8 text-[var(--color-text-muted)] mx-auto opacity-50" />
        <h4 className="text-xs font-bold text-[var(--color-text-primary)]">No results found</h4>
        <p className="text-xs text-[var(--color-text-muted)] font-mono">
          No matches for "{query}". Try adjusting keywords.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 shadow-2xs', className)}>
      <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] pb-2">
        <span>Found {results.length} items for "{query}"</span>
        {onClearQuery && (
          <button type="button" onClick={onClearQuery} className="hover:text-[var(--color-text-primary)] cursor-pointer">
            Clear query
          </button>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[var(--color-accent)]" /> {category}
            </div>

            <div className="space-y-1">
              {items.map((res) => (
                <ListItem
                  key={res.id}
                  title={res.title}
                  subtitle={res.description}
                  icon={res.icon}
                  endContent={res.badge ? <Badge variant="accent" size="sm">{res.badge}</Badge> : undefined}
                  onClick={res.onClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
