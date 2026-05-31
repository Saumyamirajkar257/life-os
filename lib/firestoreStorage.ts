import { StateStorage } from 'zustand/middleware';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

interface GranularMapping {
  stateKey: string;
  collectionName: string;
}

let isSyncingFromServer = false;

export const setSyncingFromServer = (val: boolean) => {
  isSyncingFromServer = val;
};

// Maps Zustand stores to their Firestore collections
const GRANULAR_STORES: Record<string, GranularMapping[]> = {
  'life-os-tasks': [{ stateKey: 'tasks', collectionName: 'tasks' }],
  'life-os-habits': [{ stateKey: 'habits', collectionName: 'habits' }],
  'life-os-journal': [{ stateKey: 'entries', collectionName: 'journal' }],
  'life-os-brain': [{ stateKey: 'nodes', collectionName: 'brain_nodes' }],
  'life-os-finance': [
    { stateKey: 'transactions', collectionName: 'finance' },
    { stateKey: 'goals', collectionName: 'finance_goals' },
    { stateKey: 'budgets', collectionName: 'finance_budgets' }
  ],
  'life-os-focus': [{ stateKey: 'blockedSites', collectionName: 'blocked_sites' }],
  'life-os-friends': [
    { stateKey: 'friendsList', collectionName: 'friends' },
    { stateKey: 'friendRequests', collectionName: 'friend_requests' }
  ],
  'life-os-vault': [{ stateKey: 'resources', collectionName: 'vault_resources' }],
  'life-os-achievements': [{ stateKey: 'achievements', collectionName: 'achievements' }]
};

const sanitizeStateObject = (stateObj: any, name: string): any => {
  if (!stateObj || !stateObj.state) return stateObj;
  const mappings = GRANULAR_STORES[name];
  if (!mappings) return stateObj;

  for (const mapping of mappings) {
    const items = stateObj.state[mapping.stateKey];
    if (Array.isArray(items)) {
      const uniqueItems: any[] = [];
      const seenIds = new Set<string>();
      for (const item of items) {
        if (!item || typeof item !== 'object') {
          uniqueItems.push(item);
          continue;
        }
        if (!item.id) {
          const newId = `${name.replace('life-os-', '')}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          uniqueItems.push({ ...item, id: newId });
          seenIds.add(newId);
        } else if (seenIds.has(item.id)) {
          const newId = `${item.id}-dup-${Math.random().toString(36).substring(2, 9)}`;
          uniqueItems.push({ ...item, id: newId });
          seenIds.add(newId);
        } else {
          uniqueItems.push(item);
          seenIds.add(item.id);
        }
      }
      stateObj.state[mapping.stateKey] = uniqueItems;
    }
  }
  return stateObj;
};

const sanitizeMonolithicStorageString = (val: string | null, name: string): string | null => {
  if (!val) return null;
  try {
    const parsed = JSON.parse(val);
    const sanitized = sanitizeStateObject(parsed, name);
    return JSON.stringify(sanitized);
  } catch (e) {
    return val;
  }
};

export const createFirestoreStorage = (): StateStorage => ({
  getItem: async (name: string): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) {
      return sanitizeMonolithicStorageString(localStorage.getItem(name), name);
    }
    try {
      const docRef = doc(db, 'users', user.uid, 'store', name);
      const snap = await getDoc(docRef);

      // If store is not mapped as granular, load monolithic document
      if (!GRANULAR_STORES[name]) {
        if (snap.exists()) {
          return snap.data().value;
        }
        return null;
      }

      // Reconstruct state from base config + granular sub-collections
      let stateObj: any = { state: {}, version: 0 };
      if (snap.exists()) {
        try {
          stateObj = JSON.parse(snap.data().value);
        } catch (e) {
          console.error(`Failed to parse base doc for ${name}`, e);
        }
      }

      const mappings = GRANULAR_STORES[name];
      for (const mapping of mappings) {
        const colRef = collection(db, 'users', user.uid, mapping.collectionName);
        const qSnap = await getDocs(colRef);
        let items: any[] = [];

        if (qSnap.empty) {
          // Backward Compatibility: Migrate legacy monolithic arrays to individual documents
          const legacyItems = stateObj.state?.[mapping.stateKey];
          if (Array.isArray(legacyItems) && legacyItems.length > 0) {
            console.log(`Migrating monolithic legacy array for ${name} (${mapping.stateKey}) to Firestore sub-collection...`);
            
            const migrationPromises = legacyItems.map((item, index) => {
              const itemDocRef = doc(db, 'users', user.uid, mapping.collectionName, item.id);
              return setDoc(itemDocRef, { ...item, _index: index });
            });
            await Promise.all(migrationPromises);
            items = legacyItems;
          }
        } else {
          qSnap.forEach((doc) => {
            items.push({ ...doc.data(), id: doc.id });
          });
          // Sort elements using index to preserve state array order
          items.sort((a, b) => (a._index ?? 0) - (b._index ?? 0));
          // Strip order tracker
          items.forEach((item) => {
            delete item._index;
          });
        }

        if (!stateObj.state) {
          stateObj.state = {};
        }
        stateObj.state[mapping.stateKey] = items;
      }

      return JSON.stringify(sanitizeStateObject(stateObj, name));
    } catch (e) {
      console.warn(`Firestore granular read failed for ${name}`, e);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      localStorage.setItem(name, value);
      return;
    }
    
    if (isSyncingFromServer) {
      // Loop protection: skip writing back to Firestore if the change originated from the server
      const diffCacheKey = `life-os-prev-${user.uid}-${name}`;
      localStorage.setItem(diffCacheKey, value);
      return;
    }
    
    // Do not save store caches to localStorage when logged in (Firebase is strict source of truth)

    // KICK OFF database writes in the background to prevent blocking the event loop
    (async () => {
      try {
        // If store is not mapped as granular, write monolithic document in background
        if (!GRANULAR_STORES[name]) {
          const docRef = doc(db, 'users', user.uid, 'store', name);
          await setDoc(docRef, { value });
          return;
        }

        let parsed: any;
        try {
          parsed = JSON.parse(value);
        } catch (e) {
          console.error(`Failed to parse state values for background writing ${name}`, e);
          return;
        }

        // Read background-specific tracking key to compute accurate diffs asynchronously (user-scoped to prevent account leaks)
        const diffCacheKey = `life-os-prev-${user.uid}-${name}`;
        const localPrevStr = localStorage.getItem(diffCacheKey);
        let localPrevState: any = null;
        if (localPrevStr) {
          try {
            localPrevState = JSON.parse(localPrevStr);
          } catch (e) {}
        }

        const mappings = GRANULAR_STORES[name];
        for (const mapping of mappings) {
          const newItems: any[] = parsed.state?.[mapping.stateKey] || [];
          const prevItems: any[] = localPrevState?.state?.[mapping.stateKey] || [];

          // 1. Identify new/modified documents to update
          const itemsToWrite = newItems.filter((newItem) => {
            const prevItem = prevItems.find((p) => p.id === newItem.id);
            if (!prevItem) return true; // new document
            return JSON.stringify(newItem) !== JSON.stringify(prevItem); // modified document
          });

          // 2. Identify removed documents to delete
          const itemsToDelete = prevItems.filter(
            (prevItem) => !newItems.some((n) => n.id === prevItem.id)
          );

          const writePromises = itemsToWrite.map((item) => {
            const originalIndex = newItems.findIndex((n) => n.id === item.id);
            const itemDocRef = doc(db, 'users', user.uid, mapping.collectionName, item.id);
            return setDoc(itemDocRef, { ...item, _index: originalIndex });
          });

          const deletePromises = itemsToDelete.map((item) => {
            const itemDocRef = doc(db, 'users', user.uid, mapping.collectionName, item.id);
            return deleteDoc(itemDocRef);
          });

          await Promise.all([...writePromises, ...deletePromises]);
        }

        // 3. Write non-granular variables to the base config document
        const baseStateObj = JSON.parse(value);
        for (const mapping of mappings) {
          if (baseStateObj.state) {
            delete baseStateObj.state[mapping.stateKey];
          }
        }
        const baseDocRef = doc(db, 'users', user.uid, 'store', name);
        await setDoc(baseDocRef, { value: JSON.stringify(baseStateObj) });

        // Update secondary tracking key for the next loop's diff calculation
        localStorage.setItem(diffCacheKey, value);
      } catch (e) {
        console.error(`Firestore background sync failed for ${name}`, e);
      }
    })();
  },

  removeItem: async (name: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      localStorage.removeItem(name);
      return;
    }
    try {
      if (GRANULAR_STORES[name]) {
        const mappings = GRANULAR_STORES[name];
        for (const mapping of mappings) {
          const colRef = collection(db, 'users', user.uid, mapping.collectionName);
          const qSnap = await getDocs(colRef);
          const deletePromises: Promise<void>[] = [];
          qSnap.forEach((doc) => {
            deletePromises.push(deleteDoc(doc.ref));
          });
          await Promise.all(deletePromises);
        }
      }
      const docRef = doc(db, 'users', user.uid, 'store', name);
      await deleteDoc(docRef);
      
      const diffCacheKey = `life-os-prev-${user.uid}-${name}`;
      localStorage.removeItem(diffCacheKey);
    } catch (e) {
      console.error(`Firestore delete failed for ${name}`, e);
    }
  }
});
