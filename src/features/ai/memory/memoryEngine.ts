/**
 * @file memoryEngine.ts
 * @description Memory Engine implementation for Aura Intelligence.
 * Manages long-term structured facts, user preferences, schedules, routines, and memory search/updates.
 * @module AuraAI/Memory
 */

import { AIMemoryItem, MemoryCategory, MemoryImportance } from '../types';
import { INITIAL_MEMORIES } from '../constants';

export class MemoryEngine {
  private static memories: AIMemoryItem[] = [...INITIAL_MEMORIES];

  public static getMemories(): AIMemoryItem[] {
    return this.memories;
  }

  public static searchMemories(query: string, category?: MemoryCategory): AIMemoryItem[] {
    const q = query.toLowerCase();
    return this.memories.filter((m) => {
      const matchCat = category ? m.category === category : true;
      const matchText = m.key.toLowerCase().includes(q) || m.value.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }

  public static addMemory(
    category: MemoryCategory,
    key: string,
    value: string,
    importance: MemoryImportance = 'medium',
    source: string = 'user_explicit'
  ): AIMemoryItem {
    const newItem: AIMemoryItem = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: 'user_default',
      category,
      key,
      value,
      importance,
      source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memories.unshift(newItem);
    return newItem;
  }

  public static updateMemory(id: string, updates: Partial<Omit<AIMemoryItem, 'id' | 'createdAt'>>): AIMemoryItem | null {
    const index = this.memories.findIndex((m) => m.id === id);
    if (index === -1) return null;
    this.memories[index] = {
      ...this.memories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.memories[index];
  }

  public static deleteMemory(id: string): boolean {
    const initialLen = this.memories.length;
    this.memories = this.memories.filter((m) => m.id !== id);
    return this.memories.length < initialLen;
  }

  public static getRelevantMemoriesForPrompt(): string {
    const criticalAndHigh = this.memories.filter((m) => m.importance === 'critical' || m.importance === 'high');
    if (criticalAndHigh.length === 0) return '';

    return `\n[MEMORY RECALL]\n` + criticalAndHigh.map((m) => `- ${m.key}: ${m.value}`).join('\n');
  }
}
