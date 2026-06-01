import { auth, db } from './firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  writeBatch 
} from 'firebase/firestore';

// Stores imports
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useJournalStore } from '@/store/useJournalStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useBrainStore } from '@/store/useBrainStore';
import { useFocusStore } from '@/store/useFocusStore';
import { useFriendsStore } from '@/store/useFriendsStore';
import { useVaultStore } from '@/store/useVaultStore';
import { useAchievementsStore } from '@/store/useAchievementsStore';
import { useAppStore } from '@/store/useAppStore';
import { useAIStore } from '@/store/useAIStore';
import { useAutomationsStore } from '@/store/useAutomationsStore';
import { useRoutinesStore } from '@/store/useRoutinesStore';
import { useCompanionStore } from '@/store/useCompanionStore';
import { useNotificationStore } from '@/store/useNotificationStore';

// Storage loop protection and sync store
import { setSyncingFromServer } from './firestoreStorage';
import { useSyncStore } from '@/store/useSyncStore';
import { useToast } from '@/components/ui/Toast';

let unsubscribes: (() => void)[] = [];
let onlineListener: (() => void) | null = null;
let offlineListener: (() => void) | null = null;

// Realtime Sync Initialization
export function startRealtimeSync(userId: string) {
  stopRealtimeSync();

  const syncStore = useSyncStore.getState();
  syncStore.setStatus('syncing');

  // Network connection monitoring
  if (typeof window !== 'undefined') {
    onlineListener = () => {
      syncStore.setStatus('synced');
    };
    offlineListener = () => {
      syncStore.setStatus('offline');
    };
    window.addEventListener('online', onlineListener);
    window.addEventListener('offline', offlineListener);

    if (!navigator.onLine) {
      syncStore.setStatus('offline');
    }
  }

  // Safe Zustand setState helper avoiding loops
  const updateGranularState = (store: any, key: string, data: any) => {
    setSyncingFromServer(true);
    store.setState({ [key]: data });
    setSyncingFromServer(false);
  };

  const updateMonolithicState = (store: any, value: string, name: string) => {
    try {
      const parsed = JSON.parse(value);
      if (parsed && parsed.state) {
        setSyncingFromServer(true);
        store.setState(parsed.state);
        setSyncingFromServer(false);

        // Keep local cache key for diff calculations synced
        const diffCacheKey = `life-os-prev-${userId}-${name}`;
        localStorage.setItem(diffCacheKey, value);
      }
    } catch (e) {
      console.error(`Failed to parse monolithic sync for ${name}`, e);
    }
  };

  try {
    // 1. Profile document Info listener
    const profileRef = doc(db, 'users', userId, 'profile', 'info');
    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSyncingFromServer(true);
        useAppStore.setState({
          userName: data.displayName || '',
          userEmail: data.email || '',
          userHandle: data.handle || '',
          userPfp: data.photoURL || '',
        });
        setSyncingFromServer(false);
      }
      syncStore.setSectionLoaded('profile', true);
      if (navigator.onLine && syncStore.status !== 'error') {
        syncStore.setStatus('synced');
      }
    }, (err) => {
      console.error('Profile snapshot error:', err);
      syncStore.setStatus('error');
    });
    unsubscribes.push(unsubProfile);

    // 2. Tasks sub-collection listener
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const unsubTasks = onSnapshot(tasksRef, (snap) => {
      const tasks: any[] = [];
      snap.forEach((doc) => {
        tasks.push({ ...doc.data(), id: doc.id });
      });
      tasks.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      tasks.forEach((t) => delete t._index);

      updateGranularState(useTasksStore, 'tasks', tasks);
      syncStore.setSectionLoaded('tasks', true);
      
      if (navigator.onLine && syncStore.status !== 'error') {
        syncStore.setStatus('synced');
      }

      // Automatically recalculate today's analytics summary
      const habits = useHabitsStore.getState().habits;
      triggerAnalyticsUpdate(userId, tasks, habits);
    }, (err) => {
      console.error('Tasks snapshot error:', err);
      syncStore.setStatus('error');
    });
    unsubscribes.push(unsubTasks);

    // 3. Habits sub-collection listener
    const habitsRef = collection(db, 'users', userId, 'habits');
    const unsubHabits = onSnapshot(habitsRef, (snap) => {
      const habits: any[] = [];
      snap.forEach((doc) => {
        habits.push({ ...doc.data(), id: doc.id });
      });
      habits.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      habits.forEach((h) => delete h._index);

      updateGranularState(useHabitsStore, 'habits', habits);
      syncStore.setSectionLoaded('habits', true);

      if (navigator.onLine && syncStore.status !== 'error') {
        syncStore.setStatus('synced');
      }

      const tasks = useTasksStore.getState().tasks;
      triggerAnalyticsUpdate(userId, tasks, habits);
    }, (err) => {
      console.error('Habits snapshot error:', err);
      syncStore.setStatus('error');
    });
    unsubscribes.push(unsubHabits);

    // 4. Journal sub-collection listener
    const journalRef = collection(db, 'users', userId, 'journal');
    const unsubJournal = onSnapshot(journalRef, (snap) => {
      const entries: any[] = [];
      snap.forEach((doc) => {
        entries.push({ ...doc.data(), id: doc.id });
      });
      entries.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      entries.forEach((e) => delete e._index);

      updateGranularState(useJournalStore, 'entries', entries);
      syncStore.setSectionLoaded('journal', true);

      if (navigator.onLine && syncStore.status !== 'error') {
        syncStore.setStatus('synced');
      }
    }, (err) => {
      console.error('Journal snapshot error:', err);
      syncStore.setStatus('error');
    });
    unsubscribes.push(unsubJournal);

    // 5. Finance Transactions sub-collection listener
    const financeRef = collection(db, 'users', userId, 'finance');
    const unsubFinance = onSnapshot(financeRef, (snap) => {
      const transactions: any[] = [];
      snap.forEach((doc) => {
        transactions.push({ ...doc.data(), id: doc.id });
      });
      transactions.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      transactions.forEach((t) => delete t._index);

      updateGranularState(useFinanceStore, 'transactions', transactions);
      syncStore.setSectionLoaded('finance', true);

      if (navigator.onLine && syncStore.status !== 'error') {
        syncStore.setStatus('synced');
      }
    }, (err) => {
      console.error('Finance transactions snapshot error:', err);
      syncStore.setStatus('error');
    });
    unsubscribes.push(unsubFinance);

    // 6. Finance Goals
    const goalsRef = collection(db, 'users', userId, 'finance_goals');
    const unsubGoals = onSnapshot(goalsRef, (snap) => {
      const goals: any[] = [];
      snap.forEach((doc) => {
        goals.push({ ...doc.data(), id: doc.id });
      });
      goals.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      goals.forEach((g) => delete g._index);
      updateGranularState(useFinanceStore, 'goals', goals);
    }, (err) => console.error('Goals snapshot error:', err));
    unsubscribes.push(unsubGoals);

    // 7. Finance Budgets
    const budgetsRef = collection(db, 'users', userId, 'finance_budgets');
    const unsubBudgets = onSnapshot(budgetsRef, (snap) => {
      const budgets: any[] = [];
      snap.forEach((doc) => {
        budgets.push({ ...doc.data(), id: doc.id });
      });
      budgets.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      budgets.forEach((b) => delete b._index);
      updateGranularState(useFinanceStore, 'budgets', budgets);
    }, (err) => console.error('Budgets snapshot error:', err));
    unsubscribes.push(unsubBudgets);

    // 8. Brain Nodes
    const brainRef = collection(db, 'users', userId, 'brain_nodes');
    const unsubBrain = onSnapshot(brainRef, (snap) => {
      const nodes: any[] = [];
      snap.forEach((doc) => {
        nodes.push({ ...doc.data(), id: doc.id });
      });
      nodes.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      nodes.forEach((n) => delete n._index);
      updateGranularState(useBrainStore, 'nodes', nodes);
    }, (err) => console.error('Brain snapshot error:', err));
    unsubscribes.push(unsubBrain);

    // 9. Blocked Sites (Focus Store)
    const blockedRef = collection(db, 'users', userId, 'blocked_sites');
    const unsubBlocked = onSnapshot(blockedRef, (snap) => {
      const blockedSites: any[] = [];
      snap.forEach((doc) => {
        blockedSites.push({ ...doc.data(), id: doc.id });
      });
      blockedSites.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      blockedSites.forEach((s) => delete s._index);
      updateGranularState(useFocusStore, 'blockedSites', blockedSites);
    }, (err) => console.error('Blocked sites snapshot error:', err));
    unsubscribes.push(unsubBlocked);

    // 10. Friends
    const friendsRef = collection(db, 'users', userId, 'friends');
    const unsubFriends = onSnapshot(friendsRef, (snap) => {
      const friendsList: any[] = [];
      snap.forEach((doc) => {
        friendsList.push({ ...doc.data(), id: doc.id });
      });
      friendsList.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      friendsList.forEach((f) => delete f._index);
      updateGranularState(useFriendsStore, 'friendsList', friendsList);
    }, (err) => console.error('Friends snapshot error:', err));
    unsubscribes.push(unsubFriends);

    // 11. Friend Requests
    const reqsRef = collection(db, 'users', userId, 'friend_requests');
    const unsubReqs = onSnapshot(reqsRef, (snap) => {
      const friendRequests: any[] = [];
      snap.forEach((doc) => {
        friendRequests.push({ ...doc.data(), id: doc.id });
      });
      friendRequests.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      friendRequests.forEach((r) => delete r._index);
      updateGranularState(useFriendsStore, 'friendRequests', friendRequests);
    }, (err) => console.error('Friend requests snapshot error:', err));
    unsubscribes.push(unsubReqs);

    // 12. Vault Resources
    const vaultRef = collection(db, 'users', userId, 'vault_resources');
    const unsubVault = onSnapshot(vaultRef, (snap) => {
      const resources: any[] = [];
      snap.forEach((doc) => {
        resources.push({ ...doc.data(), id: doc.id });
      });
      resources.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      resources.forEach((r) => delete r._index);
      updateGranularState(useVaultStore, 'resources', resources);
    }, (err) => console.error('Vault snapshot error:', err));
    unsubscribes.push(unsubVault);

    // 13. Achievements
    const achsRef = collection(db, 'users', userId, 'achievements');
    const unsubAchs = onSnapshot(achsRef, (snap) => {
      const achievements: any[] = [];
      snap.forEach((doc) => {
        achievements.push({ ...doc.data(), id: doc.id });
      });
      achievements.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
      achievements.forEach((a) => delete a._index);
      updateGranularState(useAchievementsStore, 'achievements', achievements);
    }, (err) => console.error('Achievements snapshot error:', err));
    unsubscribes.push(unsubAchs);

    // 14. Monolithic Store Listeners
    const monolithicStores = [
      { name: 'life-os-ai-core', store: useAIStore },
      { name: 'life-os-automations', store: useAutomationsStore },
      { name: 'life-os-routines', store: useRoutinesStore },
      { name: 'life-os-companion-settings', store: useCompanionStore },
      { name: 'life-os-notifications', store: useNotificationStore }
    ];

    monolithicStores.forEach(({ name, store }) => {
      const docRef = doc(db, 'users', userId, 'store', name);
      const unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists() && snap.data().value) {
          updateMonolithicState(store, snap.data().value, name);
        }
      }, (err) => console.error(`Monolithic snapshot error for ${name}:`, err));
      unsubscribes.push(unsub);
    });

  } catch (err) {
    console.error('Failed to attach real-time snapshot listeners:', err);
    syncStore.setStatus('error');
  }
}

// Tear down listeners and connection monitoring on logout
export function stopRealtimeSync() {
  unsubscribes.forEach((unsub) => unsub());
  unsubscribes = [];

  if (typeof window !== 'undefined') {
    if (onlineListener) {
      window.removeEventListener('online', onlineListener);
      onlineListener = null;
    }
    if (offlineListener) {
      window.removeEventListener('offline', offlineListener);
      offlineListener = null;
    }
  }

  useSyncStore.getState().reset();
}

// Debounce trigger to save write resources on updates
let analyticsTimeout: NodeJS.Timeout | null = null;
function triggerAnalyticsUpdate(userId: string, tasks: any[], habits: any[]) {
  if (analyticsTimeout) clearTimeout(analyticsTimeout);
  analyticsTimeout = setTimeout(() => {
    // Get YYYY-MM-DD in local time
    const localDate = new Date();
    const offset = localDate.getTimezoneOffset();
    const localToday = new Date(localDate.getTime() - (offset * 60 * 1000));
    const dateStr = localToday.toISOString().split('T')[0];

    updateDailyAnalytics(userId, dateStr, tasks, habits).catch(console.error);
  }, 1000);
}

// Compute & update telemetry values under users/{userId}/analytics/{date}
async function updateDailyAnalytics(userId: string, dateStr: string, tasks: any[], habits: any[]) {
  try {
    const tasksCompleted = tasks.filter(t => t.completed && t.dueDate === dateStr).length;
    const habitsCompleted = habits.filter(h => h.completedDates?.includes(dateStr)).length;
    // Estimate focusMinutes based on tasks (30m) & habits (15m) completion metrics
    const focusMinutes = (tasksCompleted * 30) + (habitsCompleted * 15);

    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length || 1;
    const habitCompletionRate = habits.length > 0
      ? habits.reduce((acc, h) => acc + (h.completedDates?.includes(dateStr) ? 1 : 0), 0) / habits.length
      : 0.5;

    const productivityScore = Math.min(100, Math.round((completedCount / totalCount) * 50 + habitCompletionRate * 50));

    const analyticsDocRef = doc(db, 'users', userId, 'analytics', dateStr);
    await setDoc(analyticsDocRef, {
      tasksCompleted,
      habitsCompleted,
      focusMinutes,
      productivityScore
    }, { merge: true });
  } catch (e) {
    console.error('Failed to sync daily analytics summary to Firestore:', e);
  }
}

// Checks localStorage for legacy keys, migrates to sub-collections, clears cache
export async function migrateLocalDataToFirestore(userId: string): Promise<boolean> {
  let migratedAny = false;
  const storesToMigrate = [
    { key: 'life-os-tasks', stateKey: 'tasks', collectionName: 'tasks' },
    { key: 'life-os-habits', stateKey: 'habits', collectionName: 'habits' },
    { key: 'life-os-journal', stateKey: 'entries', collectionName: 'journal' },
    { key: 'life-os-finance', stateKey: 'transactions', collectionName: 'finance' },
    { key: 'life-os-finance', stateKey: 'goals', collectionName: 'finance_goals' },
    { key: 'life-os-finance', stateKey: 'budgets', collectionName: 'finance_budgets' },
    { key: 'life-os-brain', stateKey: 'nodes', collectionName: 'brain_nodes' },
    { key: 'life-os-focus', stateKey: 'blockedSites', collectionName: 'blocked_sites' },
    { key: 'life-os-friends', stateKey: 'friendsList', collectionName: 'friends' },
    { key: 'life-os-friends', stateKey: 'friendRequests', collectionName: 'friend_requests' },
    { key: 'life-os-vault', stateKey: 'resources', collectionName: 'vault_resources' },
    { key: 'life-os-achievements', stateKey: 'achievements', collectionName: 'achievements' }
  ];

  for (const store of storesToMigrate) {
    const rawData = localStorage.getItem(store.key);
    if (!rawData) continue;

    try {
      const parsed = JSON.parse(rawData);
      const items = parsed.state?.[store.stateKey];
      if (Array.isArray(items) && items.length > 0) {
        console.log(`Migrating ${items.length} items from legacy ${store.key}.${store.stateKey} to Firestore...`);
        const batch = writeBatch(db);
        items.forEach((item, index) => {
          if (!item.id) {
            item.id = `${store.collectionName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          }
          const docRef = doc(db, 'users', userId, store.collectionName, item.id);
          batch.set(docRef, { ...item, _index: index }, { merge: true });
        });
        await batch.commit();
        migratedAny = true;
      }
    } catch (e) {
      console.error(`Error migrating store key ${store.key}:`, e);
    }
  }

  // Handle monolithic App Settings / Profile details
  const appSettingsRaw = localStorage.getItem('life-os-app-settings');
  if (appSettingsRaw) {
    try {
      const parsed = JSON.parse(appSettingsRaw);
      const state = parsed.state;
      if (state && (state.userName || state.userEmail)) {
        console.log('Migrating profile metadata from app-settings to Firestore...');
        const profileDocRef = doc(db, 'users', userId, 'profile', 'info');
        await setDoc(profileDocRef, {
          displayName: state.userName || '',
          email: state.userEmail || '',
          handle: state.userHandle || '',
          photoURL: state.userPfp || '',
          createdAt: new Date().toISOString(),
          isPro: true
        }, { merge: true });
        migratedAny = true;
      }
    } catch (e) {
      console.error('Error migrating app-settings metadata:', e);
    }
  }

  // Flush legacy keys only after a successful migration step
  if (migratedAny) {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('life-os-') && !key.includes('prev-')) {
        localStorage.removeItem(key);
      }
    });

    try {
      const { toast } = useToast.getState();
      toast('Data synced to cloud ☁️', 'success');
    } catch (toastErr) {
      console.warn('Toast display failed but migration succeeded', toastErr);
    }
  }

  return migratedAny;
}
