/**
 * @file financeFirestore.service.ts
 * @description Firestore persistence service for accounts, transactions, budgets, bills, and savings_goals.
 * @module Features/Finance/Services
 */

import { auth } from '@/lib/firebase/config';
import { getDb, getFirestoreSDK } from '@/lib/firebase/firestore';
import { Account, Transaction, Budget, Bill, SavingsGoal } from '../types/finance.types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.warn('Finance Firestore Warning/Error (local cache fallback active):', JSON.stringify(errInfo));
}

export const financeFirestoreService = {
  // --- ACCOUNTS ---
  async fetchAccounts(userId: string): Promise<Account[]> {
    const collectionPath = 'accounts';
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(collection(db, collectionPath), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const results: Account[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as Account);
      });
      return results;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return [];
    }
  },

  async saveAccount(account: Account): Promise<void> {
    const docPath = `accounts/${account.id}`;
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      await setDoc(doc(db, 'accounts', account.id), account, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  async deleteAccount(id: string): Promise<void> {
    const docPath = `accounts/${id}`;
    try {
      const db = await getDb();
      const { doc, deleteDoc } = await getFirestoreSDK();
      await deleteDoc(doc(db, 'accounts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // --- TRANSACTIONS ---
  async fetchTransactions(userId: string): Promise<Transaction[]> {
    const collectionPath = 'transactions';
    try {
      const db = await getDb();
      const { collection, query, where, orderBy, limit, getDocs } = await getFirestoreSDK();
      const q = query(
        collection(db, collectionPath),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(200)
      );
      const snapshot = await getDocs(q);
      const results: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as Transaction);
      });
      return results;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return [];
    }
  },

  async saveTransaction(transaction: Transaction): Promise<void> {
    const docPath = `transactions/${transaction.id}`;
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      await setDoc(doc(db, 'transactions', transaction.id), transaction, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    const docPath = `transactions/${id}`;
    try {
      const db = await getDb();
      const { doc, deleteDoc } = await getFirestoreSDK();
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // --- BUDGETS ---
  async fetchBudgets(userId: string): Promise<Budget[]> {
    const collectionPath = 'budgets';
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(collection(db, collectionPath), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const results: Budget[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as Budget);
      });
      return results;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return [];
    }
  },

  async saveBudget(budget: Budget): Promise<void> {
    const docPath = `budgets/${budget.id}`;
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      await setDoc(doc(db, 'budgets', budget.id), budget, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  async deleteBudget(id: string): Promise<void> {
    const docPath = `budgets/${id}`;
    try {
      const db = await getDb();
      const { doc, deleteDoc } = await getFirestoreSDK();
      await deleteDoc(doc(db, 'budgets', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // --- BILLS ---
  async fetchBills(userId: string): Promise<Bill[]> {
    const collectionPath = 'bills';
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(collection(db, collectionPath), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const results: Bill[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as Bill);
      });
      return results;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return [];
    }
  },

  async saveBill(bill: Bill): Promise<void> {
    const docPath = `bills/${bill.id}`;
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      await setDoc(doc(db, 'bills', bill.id), bill, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  async deleteBill(id: string): Promise<void> {
    const docPath = `bills/${id}`;
    try {
      const db = await getDb();
      const { doc, deleteDoc } = await getFirestoreSDK();
      await deleteDoc(doc(db, 'bills', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // --- SAVINGS GOALS ---
  async fetchSavingsGoals(userId: string): Promise<SavingsGoal[]> {
    const collectionPath = 'savings_goals';
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(collection(db, collectionPath), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const results: SavingsGoal[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as SavingsGoal);
      });
      return results;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return [];
    }
  },

  async saveSavingsGoal(goal: SavingsGoal): Promise<void> {
    const docPath = `savings_goals/${goal.id}`;
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      await setDoc(doc(db, 'savings_goals', goal.id), goal, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  async deleteSavingsGoal(id: string): Promise<void> {
    const docPath = `savings_goals/${id}`;
    try {
      const db = await getDb();
      const { doc, deleteDoc } = await getFirestoreSDK();
      await deleteDoc(doc(db, 'savings_goals', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },
};
