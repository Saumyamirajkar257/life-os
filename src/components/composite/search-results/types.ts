/**
 * @file types.ts
 * @description Type definitions for Composite SearchResults component.
 * @module AuraComposite/SearchResults/Types
 */

import { ReactNode } from 'react';

export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: ReactNode;
  badge?: string;
  onClick: () => void;
}

export interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
  isLoading?: boolean;
  onClearQuery?: () => void;
  className?: string;
}
