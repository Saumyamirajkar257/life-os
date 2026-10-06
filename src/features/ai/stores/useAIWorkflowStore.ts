/**
 * @file useAIWorkflowStore.ts
 * @description Zustand state management for AI Workflows & Automation Engine.
 * @module AuraAI/Stores
 */

import { create } from 'zustand';
import { AIWorkflowDefinition, WorkflowId } from '../types';
import { DEFAULT_WORKFLOWS } from '../constants';
import { WorkflowEngine } from '../workflows/workflowEngine';

interface AIWorkflowState {
  workflows: AIWorkflowDefinition[];
  activeRunningWorkflowId: WorkflowId | null;
  lastRunResult: { title: string; markdown: string } | null;

  runWorkflow: (id: WorkflowId, note?: string) => Promise<{ title: string; markdown: string }>;
  toggleWorkflow: (id: WorkflowId) => void;
  clearLastResult: () => void;
}

export const useAIWorkflowStore = create<AIWorkflowState>((set) => ({
  workflows: DEFAULT_WORKFLOWS,
  activeRunningWorkflowId: null,
  lastRunResult: null,

  runWorkflow: async (id, note) => {
    set({ activeRunningWorkflowId: id });
    const res = await WorkflowEngine.executeWorkflow(id, note);
    const resultObj = { title: res.title, markdown: res.resultMarkdown };
    set({
      activeRunningWorkflowId: null,
      lastRunResult: resultObj,
    });
    return resultObj;
  },

  toggleWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)),
    })),

  clearLastResult: () => set({ lastRunResult: null }),
}));
