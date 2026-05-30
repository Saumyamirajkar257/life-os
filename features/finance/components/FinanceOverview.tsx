'use client';

import { Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { GlassCard } from '@/components/ui';

interface FinanceOverviewProps {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
}

export function FinanceOverview({ balance, income, expenses, savingsRate }: FinanceOverviewProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const stats = [
    {
      label: 'Total Balance',
      value: formatCurrency(balance),
      change: '↑ 12.5% from last month',
      icon: Wallet,
    },
    {
      label: 'Monthly Income',
      value: formatCurrency(income),
      change: '+₹30,000 vs last month',
      icon: TrendingUp,
    },
    {
      label: 'Monthly Expenses',
      value: formatCurrency(expenses),
      change: '↓ 8% vs last month',
      icon: TrendingDown,
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate.toFixed(0)}%`,
      change: 'On track for goal',
      icon: Percent,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <GlassCard
            key={i}
            className="flex flex-col gap-2 p-5"
            glowOnHover={true}
          >
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase">
              <Icon className="w-4 h-4 text-white/30" />
              <span>{stat.label}</span>
            </div>
            <div className="font-display text-2xl font-bold text-white mt-1">
              {stat.value}
            </div>
            <div className="text-[10px] text-white/30 font-mono mt-2">
              {stat.change}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
