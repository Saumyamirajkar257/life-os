/**
 * @file CalendarPage.tsx
 * @description Master page component for Milestone 15 Calendar & Planner Module in Aura Life OS.
 * @module Features/Calendar/Pages
 */

import React from 'react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { useCalendarStore } from '../stores/useCalendarStore';
import { CalendarHeader } from '../components/CalendarHeader';
import { DailyView } from '../components/DailyView';
import { WeeklyView } from '../components/WeeklyView';
import { MonthlyView } from '../components/MonthlyView';
import { AgendaView } from '../components/AgendaView';
import { TimelineView } from '../components/TimelineView';
import { PlannerView } from '../components/PlannerView';
import { AnalyticsView } from '../components/AnalyticsView';
import { EventModal } from '../components/EventModal';
import { EventDetailModal } from '../components/EventDetailModal';

export const CalendarPage: React.FC = () => {
  const { viewMode } = useCalendarUIStore();
  const { loadEvents } = useCalendarStore();

  React.useEffect(() => {
    loadEvents('default_user');
  }, [loadEvents]);

  const renderActiveView = () => {
    switch (viewMode) {
      case 'day':
        return <DailyView />;
      case 'week':
        return <WeeklyView />;
      case 'month':
        return <MonthlyView />;
      case 'agenda':
        return <AgendaView />;
      case 'timeline':
        return <TimelineView />;
      case 'planner':
        return <PlannerView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <MonthlyView />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full min-h-screen">
      {/* Module Header Toolbar */}
      <CalendarHeader />

      {/* Active View Container */}
      <div className="flex-1 animate-in fade-in duration-300">
        {renderActiveView()}
      </div>

      {/* Global Modals */}
      <EventModal />
      <EventDetailModal />
    </div>
  );
};
