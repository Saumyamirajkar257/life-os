/**
 * @file types.ts
 * @description Type definitions for Aura Composite SearchBar component.
 * @module AuraComposite/SearchBar/Types
 */

import { ReactNode } from 'react';

export interface SearchSuggestion {
  id: string;
  label: string;
  category?: string;
  icon?: ReactNode;
}

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  shortcutHint?: string;
  recentSearches?: string[];
  onSelectRecent?: (query: string) => void;
  onClearRecent?: () => void;
  suggestions?: SearchSuggestion[];
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  className?: string;
  autoFocus?: boolean;
}
