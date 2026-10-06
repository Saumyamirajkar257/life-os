/**
 * @file index.ts
 * @description Master exports for Milestone 19 — Aura Intelligence (AI Operating System).
 * @module AuraAI
 */

export * from './types';
export * from './constants';
export * from './memory/memoryEngine';
export * from './context/contextGatherer';
export * from './prompts/promptRegistry';
export * from './providers/providerAdapter';
export * from './tools';
export * from './workflows/workflowEngine';

export * from './stores/useAIConversationStore';
export * from './stores/useAIMemoryStore';
export * from './stores/useAIContextStore';
export * from './stores/useAIProviderStore';
export * from './stores/useAIWorkflowStore';

export * from './hooks/useAIChat';
export * from './hooks/useAIMemory';
export * from './hooks/useAIContext';
export * from './hooks/useAIWorkflows';
export * from './hooks/useAIProvider';
export * from './hooks/useAIPrompts';
export * from './hooks/useAIVoice';

export * from './components/AuraAIHome';
export * from './components/AuraAIChat';
export * from './components/AIMemoryManager';
export * from './components/AIContextInspector';
export * from './components/AIWorkflowManager';
export * from './components/AIPromptRegistryView';
export * from './components/AIProviderSettings';
export * from './components/AIInsightsDashboard';

export * from './pages/AuraAIPage';
export * from './routes';
export * from './module';
