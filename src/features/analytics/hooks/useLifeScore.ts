/**
 * @file useLifeScore.ts
 * @description Hook providing access to Life Score calculation and auto-refresh triggers.
 * @module Features/Analytics/Hooks
 */

import { useEffect } from 'react';
import { useAnalyticsStore } from '../stores/useAnalyticsStore';

export function useLifeScore() {
  const { lifeScoreSummary, refreshScores } = useAnalyticsStore();

  useEffect(() => {
    refreshScores();
  }, [refreshScores]);

  return {
    summary: lifeScoreSummary,
    overallScore: lifeScoreSummary.overallScore,
    status: lifeScoreSummary.status,
    domainScores: Object.values(lifeScoreSummary.domainScores),
    refreshScores,
  };
}
