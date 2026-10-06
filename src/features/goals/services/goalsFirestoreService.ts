/**
 * @file goalsFirestoreService.ts
 * @description Firestore persistence service for Goals, Projects, and Milestones.
 * @module Features/Goals/Services
 */

import { auth } from '@/lib/firebase/config';
import { getDb, getFirestoreSDK } from '@/lib/firebase/firestore';
import { GoalItem, ProjectItem, MilestoneItem } from '../types/goal.types';

const GOALS_COLLECTION = 'goals';
const PROJECTS_COLLECTION = 'projects';
const MILESTONES_COLLECTION = 'milestones';

export const goalsFirestoreService = {
  // --- GOALS ---
  async fetchGoals(userId: string): Promise<GoalItem[]> {
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(collection(db, GOALS_COLLECTION), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const items: GoalItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as GoalItem);
      });
      return items;
    } catch (error) {
      console.warn('[GoalsService] Error fetching goals from Firestore:', error);
      return [];
    }
  },

  async saveGoal(goal: GoalItem): Promise<void> {
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      const docRef = doc(db, GOALS_COLLECTION, goal.id);
      await setDoc(docRef, goal, { merge: true });
    } catch (error) {
      console.warn('[GoalsService] Error saving goal to Firestore:', error);
    }
  },

  async deleteGoal(goalId: string): Promise<void> {
    try {
      const db = await getDb();
      const { doc, deleteDoc } = await getFirestoreSDK();
      const docRef = doc(db, GOALS_COLLECTION, goalId);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn('[GoalsService] Error deleting goal from Firestore:', error);
    }
  },

  // --- PROJECTS ---
  async fetchProjects(userId: string): Promise<ProjectItem[]> {
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(collection(db, PROJECTS_COLLECTION), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const items: ProjectItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as ProjectItem);
      });
      return items;
    } catch (error) {
      console.warn('[GoalsService] Error fetching projects from Firestore:', error);
      return [];
    }
  },

  async saveProject(project: ProjectItem): Promise<void> {
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      const docRef = doc(db, PROJECTS_COLLECTION, project.id);
      await setDoc(docRef, project, { merge: true });
    } catch (error) {
      console.warn('[GoalsService] Error saving project to Firestore:', error);
    }
  },

  // --- MILESTONES ---
  async fetchMilestones(userId: string): Promise<MilestoneItem[]> {
    try {
      const db = await getDb();
      const { collection, query, where, getDocs } = await getFirestoreSDK();
      const q = query(collection(db, MILESTONES_COLLECTION), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const items: MilestoneItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as MilestoneItem);
      });
      return items;
    } catch (error) {
      console.warn('[GoalsService] Error fetching milestones from Firestore:', error);
      return [];
    }
  },

  async saveMilestone(milestone: MilestoneItem): Promise<void> {
    try {
      const db = await getDb();
      const { doc, setDoc } = await getFirestoreSDK();
      const docRef = doc(db, MILESTONES_COLLECTION, milestone.id);
      await setDoc(docRef, milestone, { merge: true });
    } catch (error) {
      console.warn('[GoalsService] Error saving milestone to Firestore:', error);
    }
  },
};
