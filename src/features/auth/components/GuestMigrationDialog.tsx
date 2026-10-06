import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/features/tasks/stores/useTaskStore';
import { useHabitStore } from '@/features/habits/stores/useHabitStore';
import { saveTaskToFirestore } from '@/features/tasks/services/tasksFirestoreService';
import { saveHabitToFirestore } from '@/features/habits/services/habitsFirestoreService';

export const GuestMigrationDialog: React.FC = () => {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [guestTasks, setGuestTasks] = useState<any[]>([]);
  const [guestHabits, setGuestHabits] = useState<any[]>([]);

  useEffect(() => {
    // Only check once when user logs in and it's their first time loading the UI in this session
    if (user && !sessionStorage.getItem('aura_migration_checked')) {
      const tasks = useTaskStore.getState().tasks.filter(t => t.userId === 'guest-user' || t.userId === 'guest_aura_user');
      const habits = useHabitStore.getState().habits.filter(h => h.userId === 'guest-user' || h.userId === 'guest_aura_user');
      
      if (tasks.length > 0 || habits.length > 0) {
        setGuestTasks(tasks);
        setGuestHabits(habits);
        setIsOpen(true);
      }
      sessionStorage.setItem('aura_migration_checked', 'true');
    }
  }, [user]);

  const handleMigrate = async () => {
    if (!user) return;
    setIsMigrating(true);
    try {
      const taskPromises = guestTasks.map(t => {
        const updatedTask = { ...t, userId: user.uid };
        return saveTaskToFirestore(updatedTask);
      });
      const habitPromises = guestHabits.map(h => {
        const updatedHabit = { ...h, userId: user.uid };
        return saveHabitToFirestore(updatedHabit);
      });
      await Promise.all([...taskPromises, ...habitPromises]);
      
      useTaskStore.getState().initializeStore(user.uid);
      useHabitStore.getState().initializeHabits(user.uid);
      
      // Initialize other stores
      import('@/features/goals/stores/useGoalStore').then(m => m.useGoalStore.getState().loadGoals(user.uid));
      import('@/features/journal/stores/useJournalStore').then(m => m.useJournalStore.getState().loadModuleData(user.uid));
      import('@/features/calendar/stores/useCalendarStore').then(m => m.useCalendarStore.getState().loadEvents(user.uid));
      import('@/features/finance/stores/useFinanceStore').then(m => m.useFinanceStore.getState().loadModuleData(user.uid));
      
      setIsOpen(false);
    } catch (e) {
      console.error('Migration failed', e);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleStartFresh = () => {
    if (!user) return;
    useTaskStore.getState().initializeStore(user.uid);
    useHabitStore.getState().initializeHabits(user.uid);
    
    // Initialize other stores
    import('@/features/goals/stores/useGoalStore').then(m => m.useGoalStore.getState().loadGoals(user.uid));
    import('@/features/journal/stores/useJournalStore').then(m => m.useJournalStore.getState().loadModuleData(user.uid));
    import('@/features/calendar/stores/useCalendarStore').then(m => m.useCalendarStore.getState().loadEvents(user.uid));
    import('@/features/finance/stores/useFinanceStore').then(m => m.useFinanceStore.getState().loadModuleData(user.uid));
    
    setIsOpen(false);
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={handleStartFresh}
      title="Migrate Local Data?"
      description={`You have ${guestTasks.length} local tasks and ${guestHabits.length} local habits created while not signed in. Would you like to import them into your Aura account?`}
      footer={
        <>
          <Button variant="outline" onClick={handleStartFresh} disabled={isMigrating} className="w-full sm:w-auto">
            Start fresh
          </Button>
          <Button variant="primary" onClick={handleMigrate} isLoading={isMigrating} className="w-full sm:w-auto">
            Import local data
          </Button>
        </>
      }
    >
      <div className="py-2">
        Clicking "Import local data" will save your existing tasks and habits to the cloud under your signed-in account. Choosing "Start fresh" will clear them from your device.
      </div>
    </Dialog>
  );
};
