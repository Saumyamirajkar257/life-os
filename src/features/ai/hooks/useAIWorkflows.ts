/**
 * @file useAIWorkflows.ts
 * @description Hook managing AI Workflows execution and state.
 * @module AuraAI/Hooks
 */

import { useAIWorkflowStore } from '../stores/useAIWorkflowStore';

export function useAIWorkflows() {
  const store = useAIWorkflowStore();

  return {
    workflows: store.workflows,
    activeRunningWorkflowId: store.activeRunningWorkflowId,
    lastRunResult: store.lastRunResult,
    runWorkflow: store.runWorkflow,
    toggleWorkflow: store.toggleWorkflow,
    clearLastResult: store.clearLastResult,
  };
}
