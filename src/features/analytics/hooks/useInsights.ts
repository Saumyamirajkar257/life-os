/**
 * @file useInsights.ts
 * @description Hook for querying, searching, and filtering insights across categories.
 * @module Features/Analytics/Hooks
 */

import { useAnalyticsStore } from '../stores/useAnalyticsStore';

export function useInsights() {
  const { insights, searchQuery, setSearchQuery } = useAnalyticsStore();

  const filteredInsights = insights.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.domain.toLowerCase().includes(q)
    );
  });

  return {
    insights: filteredInsights,
    searchQuery,
    setSearchQuery,
  };
}
