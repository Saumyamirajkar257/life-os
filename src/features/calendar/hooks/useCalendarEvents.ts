/**
 * @file useCalendarEvents.ts
 * @description Hook providing filtered calendar events based on UI search query, category, priority, and date range.
 * @module Features/Calendar/Hooks
 */

import { useMemo } from 'react';
import { useCalendarStore } from '../stores/useCalendarStore';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { CalendarEventItem } from '../types/calendar.types';

export function useCalendarEvents() {
  const events = useCalendarStore((state) => state.events);
  const filterState = useCalendarUIStore((state) => state.filterState);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Exclude archived events unless explicitly filtering or in archive view
      if (evt.status === 'archived') return false;

      // Search query
      if (filterState.searchQuery.trim().length > 0) {
        const query = filterState.searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesDesc = evt.description?.toLowerCase().includes(query) || false;
        const matchesLoc = evt.location?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }

      // Categories
      if (filterState.categories.length > 0) {
        if (!filterState.categories.includes(evt.category)) return false;
      }

      // Priorities
      if (filterState.priorities.length > 0) {
        if (!filterState.priorities.includes(evt.priority)) return false;
      }

      // Pinned / Favourite
      if (filterState.isPinnedOnly && !evt.isPinned) return false;
      if (filterState.isFavouriteOnly && !evt.isFavourite) return false;

      return true;
    });
  }, [events, filterState]);

  return {
    events: filteredEvents,
    allEvents: events,
    totalCount: filteredEvents.length,
  };
}
