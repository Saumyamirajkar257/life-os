/**
 * @file useAIPrompts.ts
 * @description Hook managing Prompt Registry templates and versioning.
 * @module AuraAI/Hooks
 */

import { useState } from 'react';
import { PromptRegistry } from '../prompts/promptRegistry';
import { AIPromptTemplate } from '../types';

export function useAIPrompts() {
  const [templates, setTemplates] = useState<AIPromptTemplate[]>(PromptRegistry.getTemplates());

  const refresh = () => setTemplates([...PromptRegistry.getTemplates()]);

  const addTemplate = (t: Omit<AIPromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    PromptRegistry.addTemplate(t);
    refresh();
  };

  const updateTemplate = (id: string, updates: Partial<AIPromptTemplate>) => {
    PromptRegistry.updateTemplate(id, updates);
    refresh();
  };

  return {
    templates,
    addTemplate,
    updateTemplate,
  };
}
