# Aura Analytics Engine & Personal Dashboard (Milestone 20) — Documentation

## Overview
Aura Analytics provides a holistic personal life intelligence dashboard that synthesizes live operational data across all 8 core domains (Tasks, Habits, Goals, Calendar, Journal, Finance, Health, and Well-being) without duplicating data.

---

## 1. Life Score Engine Architecture (`lifeScoreEngine.ts`)
The `LifeScoreEngine` evaluates real-time state snapshots directly from active Zustand module stores:

```
┌─────────────────────────────────────────────────────────────┐
│                      Life Score Engine                      │
├───────────────────┬───────────────────┬─────────────────────┤
│   Productivity    │    Consistency    │   Health & Vitality │
│     Finance       │   Goal Progress   │   Habit Formation   │
│ Deep Focus Work   │ Learning & Growth │ Emotional Well-Being│
└───────────────────┴───────────────────┴─────────────────────┘
                               │
                [ Algorithmic Weighted Matrix ]
                               │
                 [ WHY Explanation Synthesis ]
                               │
                 [ Life Score Composite Index ]
```

### Domain Weights:
- **Productivity (15%)**: Task throughput & urgent backlog penalty.
- **Consistency (15%)**: Habit check-in adherence & streak preservation.
- **Health & Vitality (15%)**: Sleep duration & physical movement recovery.
- **Finance & Wealth (12%)**: Net worth balance, bill status & cashflow.
- **Goal Alignment (12%)**: Average milestone progress percentage.
- **Habit Formation (12%)**: Routine check-in stability curve.
- **Deep Focus Work (8%)**: Logged focus time blocks.
- **Learning & Growth (5%)**: Journal reflections & notes.
- **Emotional Well-being (3%)**: Mood sentiment analysis.
- **Life Balance (3%)**: Work-rest equilibrium.

---

## 2. Dynamic "WHY" Change Explanations
Every domain score generates explicit human-readable reasons explaining WHY the score increased or decreased (e.g. *"Score adjusted: 12/15 tasks completed, but 1 urgent task remains pending"*).

---

## 3. Recharts Data Visualization Suite
- **10-Domain Radar Chart (`LifeScoreRadarChart`)**: Multi-axis radar map visualizing equilibrium across sectors.
- **Performance Velocity Area Chart (`ProductivityTrendChart`)**: Area series tracking productivity, habits, and overall composite score across Daily, Weekly, Monthly, and Yearly intervals.
- **Finance vs Health Bar Chart (`FinanceHealthBarChart`)**: Side-by-side metric comparison of physical vitality vs financial balances.
- **30-Day Routine Heatmap (`HabitHeatmapChart`)**: GitHub-style density grid displaying 30-day habit check-in frequency.

---

## 4. Automated Insights & Executive Reports
- **Automated Insights Feed (`InsightsFeedWidget`)**: Searchable feed for Achievements, Warnings, Highlights, Streaks, Milestones, and Recommendations.
- **Executive Reports Generator (`ReportsManager`)**: Generates structured Daily Briefs, Weekly Syntheses, Monthly Summaries, and Year Reviews with one-click PDF export support.

---

## 5. Folder Tree
```
src/features/analytics/
├── charts/
│   ├── LifeScoreRadarChart.tsx      # 10-Domain Equilibrium Radar
│   ├── ProductivityTrendChart.tsx   # Multi-Series Area Velocity Chart
│   ├── FinanceHealthBarChart.tsx    # Finance vs Health Bar Chart
│   └── HabitHeatmapChart.tsx        # 30-Day Routine Heatmap
├── widgets/
│   ├── LifeScoreOverviewWidget.tsx # Master Gauge & Status Badge
│   ├── TodayFocusWidget.tsx        # Good Morning, Focus & AI Recs
│   ├── DomainScoreCards.tsx        # Sector Cards with "WHY" Explanations
│   └── InsightsFeedWidget.tsx      # Automated Insights & Alerts
├── reports/
│   └── ReportsManager.tsx          # Executive Report Generators & Exporters
├── dashboard/
│   └── PersonalDashboardView.tsx   # Consolidated Dashboard Assembly
├── insights/
│   └── InsightsExplorerView.tsx    # Insights & Reports Explorer
├── services/
│   ├── lifeScoreEngine.ts          # Algorithmic Score & Explanation Engine
│   └── analyticsDataAggregator.ts  # Historical Chart Data Aggregator
├── stores/
│   └── useAnalyticsStore.ts        # Zustand Filter & Report State
├── hooks/
│   ├── useLifeScore.ts             # Live Score Access Hook
│   ├── useAnalyticsData.ts         # Filtered Chart Series Hook
│   └── useInsights.ts              # Insights Query & Search Hook
├── pages/
│   └── AnalyticsPage.tsx           # Master Top-Level Page Container
├── types/                          # TypeScript Interfaces
├── constants/                      # Metadata & Weights
├── routes.ts                       # App Routing
├── module.ts                       # Module SDK Registration
└── index.ts                        # Master Module Barrel
```
