/**
 * @file promptRegistry.ts
 * @description Reusable Prompt Registry for Aura Intelligence.
 * Supports System, Module, Workflow, Developer, and User Prompts with versioning and template variable interpolation.
 * @module AuraAI/Prompts
 */

import { AIPromptTemplate } from '../types';
import { DEFAULT_PROMPT_TEMPLATES } from '../constants';

export class PromptRegistry {
  private static templates: AIPromptTemplate[] = [...DEFAULT_PROMPT_TEMPLATES];

  public static getTemplates(): AIPromptTemplate[] {
    return this.templates;
  }

  public static getTemplateById(id: string): AIPromptTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  public static getTemplatesByType(type: AIPromptTemplate['type']): AIPromptTemplate[] {
    return this.templates.filter((t) => t.type === type);
  }

  public static addTemplate(template: Omit<AIPromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): AIPromptTemplate {
    const newT: AIPromptTemplate = {
      ...template,
      id: `prompt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.templates.push(newT);
    return newT;
  }

  public static updateTemplate(id: string, updates: Partial<AIPromptTemplate>): AIPromptTemplate | null {
    const idx = this.templates.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.templates[idx] = {
      ...this.templates[idx],
      ...updates,
      version: (this.templates[idx].version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };
    return this.templates[idx];
  }

  public static interpolate(templateString: string, variables: Record<string, string | number | boolean>): string {
    let result = templateString;
    Object.entries(variables).forEach(([key, val]) => {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(placeholder, String(val));
    });
    return result;
  }
}
