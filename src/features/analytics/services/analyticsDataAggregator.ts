/**
 * @file analyticsDataAggregator.ts
 * @description Data aggregator for historical chart series (Daily, Weekly, Monthly, Yearly).
 * @module Features/Analytics/Services
 */

export interface TrendDataPoint {
  label: string;
  productivity: number;
  habits: number;
  health: number;
  finance: number;
  lifeScore: number;
}

export class AnalyticsDataAggregator {
  public static getTrendSeries(range: 'daily' | 'weekly' | 'monthly' | 'yearly'): TrendDataPoint[] {
    if (range === 'daily') {
      return [
        { label: '08:00', productivity: 60, habits: 40, health: 90, finance: 85, lifeScore: 72 },
        { label: '11:00', productivity: 85, habits: 70, health: 88, finance: 85, lifeScore: 82 },
        { label: '14:00', productivity: 92, habits: 80, health: 85, finance: 88, lifeScore: 86 },
        { label: '17:00', productivity: 88, habits: 90, health: 85, finance: 88, lifeScore: 87 },
        { label: '20:00', productivity: 85, habits: 100, health: 88, finance: 90, lifeScore: 89 },
      ];
    }

    if (range === 'weekly') {
      return [
        { label: 'Mon', productivity: 82, habits: 80, health: 85, finance: 88, lifeScore: 83 },
        { label: 'Tue', productivity: 88, habits: 90, health: 86, finance: 88, lifeScore: 88 },
        { label: 'Wed', productivity: 95, habits: 85, health: 88, finance: 90, lifeScore: 89 },
        { label: 'Thu', productivity: 78, habits: 75, health: 82, finance: 88, lifeScore: 81 },
        { label: 'Fri', productivity: 85, habits: 80, health: 84, finance: 91, lifeScore: 85 },
        { label: 'Sat', productivity: 70, habits: 95, health: 92, finance: 91, lifeScore: 87 },
        { label: 'Sun', productivity: 75, habits: 100, health: 90, finance: 92, lifeScore: 88 },
      ];
    }

    if (range === 'monthly') {
      return [
        { label: 'Week 1', productivity: 80, habits: 75, health: 82, finance: 85, lifeScore: 80 },
        { label: 'Week 2', productivity: 84, habits: 82, health: 85, finance: 87, lifeScore: 84 },
        { label: 'Week 3', productivity: 89, habits: 88, health: 86, finance: 90, lifeScore: 88 },
        { label: 'Week 4', productivity: 92, habits: 90, health: 88, finance: 92, lifeScore: 90 },
      ];
    }

    // Yearly
    return [
      { label: 'Jan', productivity: 75, habits: 70, health: 80, finance: 80, lifeScore: 76 },
      { label: 'Feb', productivity: 78, habits: 72, health: 82, finance: 82, lifeScore: 78 },
      { label: 'Mar', productivity: 82, habits: 78, health: 84, finance: 84, lifeScore: 82 },
      { label: 'Apr', productivity: 85, habits: 80, health: 85, finance: 86, lifeScore: 84 },
      { label: 'May', productivity: 88, habits: 85, health: 86, finance: 88, lifeScore: 86 },
      { label: 'Jun', productivity: 86, habits: 88, health: 88, finance: 90, lifeScore: 88 },
      { label: 'Jul', productivity: 90, habits: 92, health: 89, finance: 92, lifeScore: 91 },
    ];
  }

  public static getHabitHeatmapData(): { date: string; count: number; level: number }[] {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = Math.floor(Math.random() * 5) + 1;
      data.push({
        date: dateStr,
        count,
        level: count >= 4 ? 3 : count >= 2 ? 2 : 1,
      });
    }
    return data;
  }
}
