/**
 * @file useCalendarStore.ts
 * @description Main Zustand store managing Calendar events with optimistic updates and Firestore sync.
 * @module Features/Calendar/Stores
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { auth } from '@/lib/firebase/config';
import { CalendarEventItem } from '../types/calendar.types';
import { INITIAL_EVENTS } from '../constants/calendarConstants';
import { fetchUserEvents, saveUserEvent, deleteUserEvent } from '../services/calendarFirestore.service';

interface CalendarState {
  events: CalendarEventItem[];
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: string | null;

  // Actions
  loadEvents: (userId?: string) => Promise<void>;
  createEvent: (event: Omit<CalendarEventItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CalendarEventItem>;
  updateEvent: (id: string, updates: Partial<CalendarEventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  duplicateEvent: (id: string) => Promise<CalendarEventItem | null>;
  toggleFavourite: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  archiveEvent: (id: string) => Promise<void>;
  restoreEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => CalendarEventItem | undefined;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      isLoading: false,
      error: null,
      lastSyncedAt: null,

      loadEvents: async (userId) => {
        const activeUid = userId || auth.currentUser?.uid;
        if (!activeUid) {
          set({ isLoading: false });
          return;
        }
        if (get().events.length === 0) {
          set({ isLoading: true, error: null });
        }
        try {
          const fetched = await fetchUserEvents(activeUid);
          set({
            events: fetched,
            isLoading: false,
            lastSyncedAt: new Date().toISOString(),
          });
        } catch (err) {
          console.error('Failed to load events:', err);
          set({ isLoading: false, error: 'Failed to load events from server.' });
        }
      },

      createEvent: async (payload) => {
        const id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();
        const activeUid = auth.currentUser?.uid || payload.userId || 'default_user';
        const newEvent: CalendarEventItem = {
          ...payload,
          id,
          userId: activeUid,
          createdAt: now,
          updatedAt: now,
        };

        // Optimistic update
        set((state) => ({ events: [newEvent, ...state.events] }));
        saveUserEvent(newEvent);
        return newEvent;
      },

      updateEvent: async (id, updates) => {
        const now = new Date().toISOString();
        let updatedEvent: CalendarEventItem | null = null;

        set((state) => {
          const events = state.events.map((evt) => {
            if (evt.id === id) {
              updatedEvent = { ...evt, ...updates, updatedAt: now };
              return updatedEvent;
            }
            return evt;
          });
          return { events };
        });

        if (updatedEvent) {
          saveUserEvent(updatedEvent);
        }
      },

      deleteEvent: async (id) => {
        set((state) => ({
          events: state.events.filter((evt) => evt.id !== id),
        }));
        deleteUserEvent(id);
      },

      duplicateEvent: async (id) => {
        const original = get().getEventById(id);
        if (!original) return null;

        const { id: _, createdAt: __, updatedAt: ___, ...rest } = original;
        return get().createEvent({
          ...rest,
          title: `${rest.title} (Copy)`,
        });
      },

      toggleFavourite: async (id) => {
        const evt = get().getEventById(id);
        if (evt) {
          get().updateEvent(id, { isFavourite: !evt.isFavourite });
        }
      },

      togglePin: async (id) => {
        const evt = get().getEventById(id);
        if (evt) {
          get().updateEvent(id, { isPinned: !evt.isPinned });
        }
      },

      archiveEvent: async (id) => {
        get().updateEvent(id, { status: 'archived' });
      },

      restoreEvent: async (id) => {
        get().updateEvent(id, { status: 'scheduled' });
      },

      getEventById: (id) => {
        return get().events.find((evt) => evt.id === id);
      },
    }),
    {
      name: 'aura-calendar-events-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
