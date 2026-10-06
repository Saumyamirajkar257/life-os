/**
 * @file useJournalAnalytics.ts
 * @description Hook calculating writing streaks, mood distributions, entries per week, and tag usage metrics.
 * @module Features/Journal/Analytics
 */

import { useMemo } from 'react';
import { useJournalStore } from '../stores/useJournalStore';
import { JournalAnalyticsSummary, MoodType } from '../types/journal.types';

export const useJournalAnalytics = (): JournalAnalyticsSummary => {
  const { journals, notes } = useJournalStore();

  return useMemo(() => {
    const activeJournals = journals.filter((j) => !j.isArchived);
    const activeNotes = notes.filter((n) => !n.isArchived);

    // Total counts & words
    const totalJournals = activeJournals.length;
    const totalNotes = activeNotes.length;

    const journalWords = activeJournals.reduce((acc, j) => acc + (j.wordCount || 0), 0);
    const noteWords = activeNotes.reduce((acc, n) => acc + (n.wordCount || 0), 0);
    const totalWordsWritten = journalWords + noteWords;

    // Estimate writing hours (based on ~35 wpm writing speed = 2100 words per hour)
    const totalWritingHours = Number((totalWordsWritten / 2100).toFixed(1));

    // Calculate Writing Streak (consecutive days with at least 1 journal or note entry)
    const datesWithEntries = new Set<string>();
    activeJournals.forEach((j) => datesWithEntries.add(j.date || j.createdAt.split('T')[0]));
    activeNotes.forEach((n) => datesWithEntries.add(n.createdAt.split('T')[0]));

    const sortedDates = Array.from(datesWithEntries).sort().reverse();

    let currentStreakDays = 0;
    let longestStreakDays = 0;

    if (sortedDates.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let checkDate = sortedDates.includes(today) ? today : sortedDates.includes(yesterday) ? yesterday : null;

      if (checkDate) {
        let streak = 0;
        let curr = new Date(checkDate);

        while (true) {
          const dateStr = curr.toISOString().split('T')[0];
          if (datesWithEntries.has(dateStr)) {
            streak++;
            curr.setDate(curr.getDate() - 1);
          } else {
            break;
          }
        }
        currentStreakDays = streak;
      }

      // Calculate longest streak
      let tempStreak = 0;
      const allDatesAsc = Array.from(datesWithEntries).sort();
      for (let i = 0; i < allDatesAsc.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prev = new Date(allDatesAsc[i - 1]);
          const curr = new Date(allDatesAsc[i]);
          const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            tempStreak = 1;
          }
        }
        if (tempStreak > longestStreakDays) {
          longestStreakDays = tempStreak;
        }
      }
    }

    // Weekly Distribution (Last 7 days)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyDistribution = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      const dateStr = d.toISOString().split('T')[0];
      const dayName = daysOfWeek[d.getDay()];

      const dayJournals = activeJournals.filter((j) => (j.date || j.createdAt.split('T')[0]) === dateStr);
      const dayNotes = activeNotes.filter((n) => n.createdAt.split('T')[0] === dateStr);

      const count = dayJournals.length + dayNotes.length;
      const wordCount =
        dayJournals.reduce((sum, j) => sum + j.wordCount, 0) +
        dayNotes.reduce((sum, n) => sum + n.wordCount, 0);

      return { day: dayName, count, wordCount };
    });

    const entriesThisWeek = weeklyDistribution.reduce((sum, d) => sum + d.count, 0);

    // Mood Distribution
    const moodCounts: Record<MoodType, number> = {
      happy: 0,
      calm: 0,
      focused: 0,
      energetic: 0,
      anxious: 0,
      sad: 0,
      creative: 0,
      neutral: 0,
    };

    activeJournals.forEach((j) => {
      if (j.mood && moodCounts[j.mood] !== undefined) {
        moodCounts[j.mood]++;
      }
    });

    const moodDistribution = (Object.keys(moodCounts) as MoodType[]).map((mood) => {
      const count = moodCounts[mood];
      const percentage = totalJournals > 0 ? Math.round((count / totalJournals) * 100) : 0;
      return { mood, count, percentage };
    });

    // Top Tags
    const tagMap: Record<string, number> = {};
    activeJournals.forEach((j) => j.tags.forEach((t) => (tagMap[t] = (tagMap[t] || 0) + 1)));
    activeNotes.forEach((n) => n.tags.forEach((t) => (tagMap[t] = (tagMap[t] || 0) + 1)));

    const topTags = Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Category Breakdown
    const catMap: Record<string, number> = {};
    activeJournals.forEach((j) => (catMap[j.category] = (catMap[j.category] || 0) + 1));
    const categoryBreakdown = Object.entries(catMap).map(([category, count]) => ({ category, count }));

    return {
      currentStreakDays,
      longestStreakDays: Math.max(currentStreakDays, longestStreakDays),
      totalJournals,
      totalNotes,
      totalWordsWritten,
      totalWritingHours,
      entriesThisWeek,
      weeklyDistribution,
      moodDistribution,
      topTags,
      categoryBreakdown,
    };
  }, [journals, notes]);
};
