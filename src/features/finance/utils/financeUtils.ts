/**
 * @file financeUtils.ts
 * @description Pure calculation and formatting utilities for financial metrics, health scores, and charts.
 * @module Features/Finance/Utils
 */

import {
  Account,
  Transaction,
  Budget,
  Bill,
  SavingsGoal,
  FinancialHealth,
  FinancialInsight,
  CashFlowPoint,
  CategorySpendingSummary,
} from '../types/finance.types';
import { TRANSACTION_CATEGORIES } from '../constants/financeConstants';

/**
 * Formats a numeric value into localized currency format (e.g. $1,485.00).
 */
export function formatCurrency(amount: number, currencyCode = 'USD', compact = false): string {
  try {
    const locale = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US';
    if (compact && Math.abs(amount) >= 1000) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(amount);
    }
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (err) {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

/**
 * Calculates net worth, total assets, and total liabilities from accounts.
 */
export function calculateNetWorth(accounts: Account[]): {
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
} {
  let totalAssets = 0;
  let totalLiabilities = 0;

  accounts.forEach((acc) => {
    if (acc.isHidden || acc.isArchived) return;
    if (acc.type === 'credit_card') {
      totalLiabilities += Math.abs(acc.balance);
    } else {
      if (acc.balance < 0) {
        totalLiabilities += Math.abs(acc.balance);
      } else {
        totalAssets += acc.balance;
      }
    }
  });

  return {
    totalNetWorth: totalAssets - totalLiabilities,
    totalAssets,
    totalLiabilities,
  };
}

/**
 * Calculates current month income and expense totals.
 */
export function calculateMonthlyIncomeAndExpense(
  transactions: Transaction[],
  targetMonthStr?: string
): { income: number; expense: number; netSavings: number } {
  const currentMonth = targetMonthStr || new Date().toISOString().slice(0, 7); // YYYY-MM

  let income = 0;
  let expense = 0;

  transactions.forEach((tx) => {
    if (!tx.date.startsWith(currentMonth)) return;
    if (tx.type === 'income') {
      income += tx.amount;
    } else if (tx.type === 'expense') {
      expense += tx.amount;
    }
  });

  return {
    income,
    expense,
    netSavings: income - expense,
  };
}

/**
 * Group expenses or income by category for pie/donut charts.
 */
export function calculateCategoryTotals(
  transactions: Transaction[],
  type: 'income' | 'expense' = 'expense',
  monthStr?: string
): CategorySpendingSummary[] {
  const currentMonth = monthStr || new Date().toISOString().slice(0, 7);
  const categoryMap: Record<string, { amount: number; count: number }> = {};

  let totalVolume = 0;

  transactions.forEach((tx) => {
    if (tx.type !== type) return;
    if (monthStr && !tx.date.startsWith(monthStr)) return;

    const catName = tx.category || 'Miscellaneous';
    if (!categoryMap[catName]) {
      categoryMap[catName] = { amount: 0, count: 0 };
    }
    categoryMap[catName].amount += tx.amount;
    categoryMap[catName].count += 1;
    totalVolume += tx.amount;
  });

  const summaries: CategorySpendingSummary[] = Object.entries(categoryMap).map(([catName, data]) => {
    const meta = TRANSACTION_CATEGORIES.find((c) => c.name === catName) || {
      color: '#64748B',
      icon: 'MoreHorizontal',
    };
    return {
      category: catName,
      totalAmount: data.amount,
      percentage: totalVolume > 0 ? (data.amount / totalVolume) * 100 : 0,
      color: meta.color,
      icon: meta.icon,
      count: data.count,
    };
  });

  return summaries.sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Calculates actual spending vs budget limit for a specific budget.
 */
export function calculateBudgetProgress(
  budget: Budget,
  transactions: Transaction[]
): { spent: number; limit: number; remaining: number; percentSpent: number; isOverBudget: boolean; isWarning: boolean } {
  const periodMonth = budget.periodDate || new Date().toISOString().slice(0, 7);

  const spent = transactions
    .filter(
      (tx) =>
        tx.type === 'expense' &&
        tx.category === budget.category &&
        tx.date.startsWith(periodMonth)
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const limit = budget.amountLimit;
  const remaining = Math.max(0, limit - spent);
  const percentSpent = limit > 0 ? (spent / limit) * 100 : 0;
  const alertThreshold = budget.alertThresholdPercent || 80;

  return {
    spent,
    limit,
    remaining,
    percentSpent,
    isOverBudget: spent > limit,
    isWarning: percentSpent >= alertThreshold && spent <= limit,
  };
}

/**
 * Generates month-by-month cash flow series (past 6 months).
 */
export function generateCashFlowSeries(transactions: Transaction[], monthsCount = 6): CashFlowPoint[] {
  const result: CashFlowPoint[] = [];
  const now = new Date();

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toISOString().slice(0, 7);
    const monthLabel = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });

    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.date.startsWith(monthKey)) {
        if (tx.type === 'income') income += tx.amount;
        if (tx.type === 'expense') expense += tx.amount;
      }
    });

    result.push({
      dateOrMonth: monthLabel,
      income,
      expense,
      net: income - expense,
    });
  }

  return result;
}

/**
 * Calculates a comprehensive Financial Health Score (0-100).
 */
export function calculateFinancialHealthScore(
  accounts: Account[],
  transactions: Transaction[],
  budgets: Budget[],
  bills: Bill[],
  savingsGoals: SavingsGoal[]
): FinancialHealth {
  const { income, expense } = calculateMonthlyIncomeAndExpense(transactions);
  const { totalAssets, totalLiabilities } = calculateNetWorth(accounts);

  // 1. Savings Rate (Target >= 20%) -> Max 30 pts
  const savingsRate = income > 0 ? Math.max(0, ((income - expense) / income) * 100) : 0;
  const savingsScore = Math.min(30, (savingsRate / 20) * 30);

  // 2. Budget Adherence -> Max 25 pts
  let budgetOverCount = 0;
  budgets.forEach((b) => {
    const { isOverBudget } = calculateBudgetProgress(b, transactions);
    if (isOverBudget) budgetOverCount++;
  });
  const totalBudgets = Math.max(1, budgets.length);
  const budgetAdherencePercent = ((totalBudgets - budgetOverCount) / totalBudgets) * 100;
  const budgetScore = (budgetAdherencePercent / 100) * 25;

  // 3. Debt-to-Income / Emergency Cushion -> Max 25 pts
  const monthlyBurn = expense > 0 ? expense : 2500;
  const liquidCash = accounts
    .filter((a) => a.type === 'savings' || a.type === 'bank' || a.type === 'cash')
    .reduce((sum, a) => sum + Math.max(0, a.balance), 0);
  const emergencyFundMonths = liquidCash / monthlyBurn;
  const cushionScore = Math.min(25, (emergencyFundMonths / 6) * 25);

  // 4. On-Time Bill Payment -> Max 20 pts
  const overdueBills = bills.filter((b) => b.status === 'overdue').length;
  const billScore = overdueBills === 0 ? 20 : Math.max(0, 20 - overdueBills * 10);

  const totalScore = Math.round(savingsScore + budgetScore + cushionScore + billScore);

  let rating: FinancialHealth['rating'] = 'Fair';
  if (totalScore >= 85) rating = 'Excellent';
  else if (totalScore >= 70) rating = 'Good';
  else if (totalScore >= 50) rating = 'Fair';
  else rating = 'Needs Attention';

  const recommendations: string[] = [];
  if (savingsRate < 20) {
    recommendations.push(`Increase monthly savings rate from ${savingsRate.toFixed(1)}% towards the 20% benchmark.`);
  }
  if (budgetOverCount > 0) {
    recommendations.push(`${budgetOverCount} budget category is currently exceeded. Adjust spending limits.`);
  }
  if (emergencyFundMonths < 6) {
    recommendations.push(`Emergency fund covers ${emergencyFundMonths.toFixed(1)} months of expenses. Aim for 6 months.`);
  }
  if (overdueBills > 0) {
    recommendations.push(`You have ${overdueBills} overdue bill reminder(s). Pay soon to avoid fees.`);
  }
  if (recommendations.length === 0) {
    recommendations.push('Your financial health indicators are performing exceptionally well across all vectors!');
  }

  const dti = income > 0 ? (totalLiabilities / (income * 12)) * 100 : 0;

  return {
    score: totalScore,
    rating,
    savingsRatePercent: Math.round(savingsRate),
    debtToIncomePercent: Math.round(dti),
    budgetAdherencePercent: Math.round(budgetAdherencePercent),
    emergencyFundMonths: Number(emergencyFundMonths.toFixed(1)),
    recommendations,
  };
}

/**
 * Generates automated heuristic insights (placeholder for future AI models).
 */
export function generateInsights(
  accounts: Account[],
  transactions: Transaction[],
  budgets: Budget[],
  bills: Bill[],
  savingsGoals: SavingsGoal[]
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const { income, expense } = calculateMonthlyIncomeAndExpense(transactions);
  const categories = calculateCategoryTotals(transactions, 'expense');

  // Highest spending category
  if (categories.length > 0) {
    const highest = categories[0];
    insights.push({
      id: 'ins_highest_spend',
      title: 'Highest Spending Category',
      type: 'tip',
      message: `${highest.category} represents ${highest.percentage.toFixed(1)}% (${formatCurrency(
        highest.totalAmount
      )}) of your total spending this month.`,
      category: highest.category,
      actionableText: 'View Category Breakdown',
      actionTab: 'reports',
      createdAt: new Date().toISOString(),
    });
  }

  // Budget warnings
  budgets.forEach((b) => {
    const { percentSpent, isOverBudget, spent, limit } = calculateBudgetProgress(b, transactions);
    if (isOverBudget) {
      insights.push({
        id: `ins_bgt_over_${b.id}`,
        title: `Over Budget Alert: ${b.name}`,
        type: 'warning',
        message: `You have spent ${formatCurrency(spent)} of your ${formatCurrency(limit)} limit (${percentSpent.toFixed(0)}%).`,
        category: b.category,
        actionableText: 'Adjust Budget',
        actionTab: 'budgets',
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Upcoming / Overdue bills
  const overdue = bills.filter((b) => b.status === 'overdue');
  if (overdue.length > 0) {
    insights.push({
      id: 'ins_overdue_bills',
      title: 'Action Needed: Overdue Bills',
      type: 'warning',
      message: `You have ${overdue.length} overdue bill(s) totaling ${formatCurrency(
        overdue.reduce((s, b) => s + b.amount, 0)
      )}.`,
      actionableText: 'Pay Bills Now',
      actionTab: 'bills',
      createdAt: new Date().toISOString(),
    });
  }

  // Savings opportunity
  if (income > expense) {
    const net = income - expense;
    insights.push({
      id: 'ins_savings_opp',
      title: 'Positive Net Cash Flow',
      type: 'opportunity',
      message: `You have a net surplus of ${formatCurrency(net)} this month. Consider allocating surplus to your Savings Goals.`,
      actionableText: 'Top Up Savings',
      actionTab: 'savings',
      createdAt: new Date().toISOString(),
    });
  }

  return insights;
}
