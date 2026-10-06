/**
 * @file searchEngine.ts
 * @description Fuzzy search engine and provider aggregator for Aura Global Search & Command Palette.
 * Integrates with Aura Module SDK to dynamically pull search results from future plugged modules.
 * @module Features/Productivity/Services/SearchEngine
 */

import { auraModuleRegistry } from '../../../sdk/module-registry/registry';
import { CommandItem, SearchResultItem } from '../types';

/**
 * Calculate fuzzy match score between search query and target string.
 * Higher score = closer match. Returns 0 if no match.
 */
export function calculateFuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;

  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();

  if (t === q) return 100;
  if (t.startsWith(q)) return 85;
  if (t.includes(q)) return 70;

  // Character sequence matching
  let qIdx = 0;
  let score = 0;
  for (let i = 0; i < t.length && qIdx < q.length; i++) {
    if (t[i] === q[qIdx]) {
      qIdx++;
      score += 5;
    }
  }

  if (qIdx === q.length) {
    return Math.min(60, score);
  }

  return 0;
}

/**
 * Execute global search across System Commands, Module SDK Registrations, and Custom Search Providers.
 */
export async function executeGlobalSearch(
  query: string,
  extraCommands: CommandItem[] = []
): Promise<SearchResultItem[]> {
  const trimmed = query.trim();
  const results: SearchResultItem[] = [];

  // 1. Process extra/system commands passed in
  for (const cmd of extraCommands) {
    const titleScore = calculateFuzzyScore(trimmed, cmd.title);
    const subtitleScore = cmd.subtitle ? calculateFuzzyScore(trimmed, cmd.subtitle) * 0.7 : 0;
    const maxScore = Math.max(titleScore, subtitleScore);

    if (maxScore > 0 || !trimmed) {
      results.push({
        id: cmd.id,
        title: cmd.title,
        subtitle: cmd.subtitle,
        category: cmd.category,
        icon: cmd.icon,
        type: 'command',
        score: maxScore,
        action: cmd.action,
      });
    }
  }

  // 2. Aggregate Module SDK Command Palette Registrations
  const sdkCommands = auraModuleRegistry.getCommandPaletteRegistrations();
  for (const cmd of sdkCommands) {
    if (cmd.isAvailable && !cmd.isAvailable()) continue;

    const titleScore = calculateFuzzyScore(trimmed, cmd.title);
    const subtitleScore = cmd.subtitle ? calculateFuzzyScore(trimmed, cmd.subtitle) * 0.7 : 0;
    const maxScore = Math.max(titleScore, subtitleScore);

    if (maxScore > 0 || !trimmed) {
      results.push({
        id: `sdk-cmd-${cmd.commandId}`,
        title: cmd.title,
        subtitle: cmd.subtitle ?? 'SDK Module Action',
        category: cmd.category ?? 'SDK Modules',
        icon: cmd.icon,
        type: 'command',
        score: maxScore,
        action: cmd.action,
      });
    }
  }

  // 3. Aggregate Module SDK Sidebar & Navigation Registrations
  const sdkSidebar = auraModuleRegistry.getSidebarRegistrations();
  for (const nav of sdkSidebar) {
    const score = calculateFuzzyScore(trimmed, nav.label);
    if (score > 0 || !trimmed) {
      results.push({
        id: `sdk-nav-${nav.itemId}`,
        title: nav.label,
        subtitle: `Navigate to ${nav.path}`,
        category: 'Navigation',
        icon: nav.icon,
        type: 'route',
        score: score,
        action: () => {
          window.location.hash = nav.path;
        },
      });
    }
  }

  // 4. Aggregate Module SDK Search Providers
  if (trimmed.length >= 2) {
    const searchProviders = auraModuleRegistry.getSearchRegistrations();
    for (const provider of searchProviders) {
      try {
        const customResults = await provider.searchHandler(trimmed);
        for (const item of customResults) {
          results.push({
            id: `sdk-search-${provider.providerId}-${item.id}`,
            title: item.title,
            subtitle: item.subtitle ?? `Search in ${provider.entityName}`,
            category: item.category ?? provider.entityName,
            icon: item.icon,
            type: 'data',
            score: 75,
            action: () => provider.onSelect(item),
            metadata: item.metadata,
          });
        }
      } catch (err) {
        console.error(`[SearchEngine] Error from search provider "${provider.providerId}":`, err);
      }
    }
  }

  // Deduplicate by ID and sort by score descending
  const uniqueMap = new Map<string, SearchResultItem>();
  for (const res of results) {
    if (!uniqueMap.has(res.id)) {
      uniqueMap.set(res.id, res);
    }
  }

  return Array.from(uniqueMap.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
