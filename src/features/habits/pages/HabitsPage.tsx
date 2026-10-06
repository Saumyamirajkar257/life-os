/**
 * @file HabitsPage.tsx
 * @description Master page component for Habits Module integrating layout, filters, list views, analytics, and modals.
 * @module Features/Habits/Pages/HabitsPage
 */

import React from 'react';
import { HabitsLayout } from '../layouts/HabitsLayout';
import { HabitFilterBar } from '../components/HabitFilterBar';
import { HabitListView } from '../components/HabitListView';
import { HabitStreakCalendar } from '../components/HabitStreakCalendar';
import { HabitAnalyticsView } from '../components/HabitAnalyticsView';
import { HabitFormModal } from '../components/HabitFormModal';
import { HabitDetailDrawer } from '../components/HabitDetailDrawer';
import { useHabitUIStore } from '../stores/useHabitUIStore';

export const HabitsPage: React.FC = () => {
  const { activeView } = useHabitUIStore();

  return (
    <HabitsLayout>
      <div className="space-y-6" id="habits-page-container">
        {/* Filter Navigation Bar */}
        <HabitFilterBar />

        {/* View Switcher */}
        {activeView === 'calendar' && <HabitStreakCalendar />}
        {activeView === 'analytics' && <HabitAnalyticsView />}
        {activeView !== 'calendar' && activeView !== 'analytics' && <HabitListView />}

        {/* Modals & Drawers */}
        <HabitFormModal />
        <HabitDetailDrawer />
      </div>
    </HabitsLayout>
  );
};

export default HabitsPage;
