'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShieldCheck, ShoppingBag, Clapperboard, Car, ArrowUpRight, ArrowDownRight, CreditCard, PiggyBank, TrendingUp, TrendingDown } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations';
import { useFinanceStore } from '@/store/useFinanceStore';
import { FinanceOverview, AddTransactionModal, AddGoalModal } from '@/features/finance';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';

export default function FinancePage() {
  const [mounted, setMounted] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'year'>('week');

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    transactions,
    goals,
    budgets,
    addTransaction,
    deleteTransaction,
    addGoal,
    updateGoalSaved,
    deleteGoal,
  } = useFinanceStore();

  const totalBalance = useMemo(() => {
    const txTotal = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    return txTotal;
  }, [transactions]);

  const monthlyIncome = useMemo(() => {
    const currentMonthTx = transactions.filter(
      (tx) => tx.type === 'income' && tx.date.startsWith(new Date().toISOString().substring(0, 7))
    );
    return currentMonthTx.reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const monthlyExpenses = useMemo(() => {
    const currentMonthTx = transactions.filter(
      (tx) => tx.type === 'expense' && tx.date.startsWith(new Date().toISOString().substring(0, 7))
    );
    return currentMonthTx.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  }, [transactions]);

  const savingsRate = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return Math.max(0, ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100);
  }, [monthlyIncome, monthlyExpenses]);

  // Transaction category icons
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'income') return ArrowUpRight;
    if (cat === 'groceries') return ShoppingBag;
    if (cat === 'housing') return ShieldCheck;
    if (cat === 'entertainment') return Clapperboard;
    if (cat === 'transport') return Car;
    return CreditCard;
  };

  const getCategoryColors = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'income') return 'bg-white/10 text-white';
    if (cat === 'groceries') return 'bg-zinc-800 text-zinc-300';
    if (cat === 'housing') return 'bg-zinc-900 text-zinc-400';
    if (cat === 'entertainment') return 'bg-zinc-700 text-zinc-300';
    return 'bg-zinc-800 text-white';
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Loading finance networks...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-6 w-full"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Finance</h1>
        <p className="text-white/40 text-sm mt-1">Track your income, expenses, and financial goals</p>
      </div>

      {/* Stats Summary Cards */}
      <FinanceOverview
        balance={totalBalance}
        income={monthlyIncome}
        expenses={monthlyExpenses}
        savingsRate={savingsRate}
      />

      {/* Grid: 2 columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Chart & Transactions */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full">
          {/* Chart card */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-medium text-white/80 text-sm tracking-wide">
                Balance Overview
              </h3>
              <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                {(['week', 'month', 'year'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md transition-all ${
                      activeTab === tab
                        ? 'bg-white text-black font-semibold'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Balance Chart */}
            <div className="h-[200px] relative w-full pt-4">
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="balanceAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#balanceAreaGradient)"
                  d="M0,170 Q50,140 100,130 T200,100 T300,70 T400,40 L400,200 L0,200 Z"
                />
                <path
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  d="M0,100 L400,100"
                />
                <path
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  d="M0,170 Q50,140 100,130 T200,100 T300,70 T400,40"
                />
                <circle cx="400" cy="40" r="5" fill="#ffffff" />
                <circle cx="400" cy="40" r="10" fill="rgba(255,255,255,0.15)" className="animate-pulse" />
              </svg>
              {/* Chart labels */}
              <div className="absolute top-2 right-2 text-[10px] font-mono text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                Live Projected: {formatCurrency(totalBalance)}
              </div>
            </div>

            <div className="flex justify-center gap-6 text-xs text-white/40 font-mono mt-1 border-t border-white/5 pt-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                <span>Net Growth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span>Safe Limit</span>
              </div>
            </div>
          </div>

          {/* Transactions card */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-display font-medium text-white/80 text-sm tracking-wide">
                Recent Transactions
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    const merchant = prompt("Enter simulated merchant string (e.g. UBER * TRIP 12.50 USD):", "UBER * TRIP 12.50 USD");
                    if (!merchant) return;
                    const amountStr = prompt("Enter original amount:", "12.50");
                    if (!amountStr) return;
                    const currency = prompt("Enter original currency:", "USD");
                    if (!currency) return;
                    
                    const amount = parseFloat(amountStr);
                    if (isNaN(amount)) return;

                    const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
                    const user = auth.currentUser;
                    const uid = user ? user.uid : (bypassed ? 'sandbox-user-id' : null);

                    if (!uid) {
                      alert("Please log in or enter Sandbox mode first.");
                      return;
                    }

                    try {
                      const res = await fetch('/api/finance/webhook', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ uid, merchant, amount, currency })
                      });
                      if (res.ok) {
                        const data = await res.json();
                        alert(`Webhook Simulated! AI Converted transaction: ${data.transaction.name} for ₹${data.transaction.amount} under [${data.transaction.category}].`);
                        // Proactively push transaction locally to Zustand store state for instant visual feedback
                        useFinanceStore.getState().addTransaction({
                          name: data.transaction.name,
                          amount: -data.transaction.amount, // negative expense inside store
                          category: data.transaction.category,
                          type: 'expense'
                        });
                      } else {
                        throw new Error('Simulation failed');
                      }
                    } catch (e) {
                      console.error(e);
                      alert('Failed to simulate Plaid Webhook.');
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl active:scale-[0.98] transition-all border border-indigo-500/20 shadow-md"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Sim Plaid Webhook</span>
                </button>

                <button
                  onClick={() => setIsTxModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Transaction</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {transactions.map((tx) => {
                  const Icon = getCategoryIcon(tx.category);
                  const colors = getCategoryColors(tx.category);
                  const isExpense = tx.type === 'expense';
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      key={tx.id}
                      className="group flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.01] px-2 rounded-lg -mx-2 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 shrink-0 ${colors}`}>
                          <Icon className="w-5 h-5 stroke-[1.5]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-white/90 transition-all">
                            {tx.name}
                          </div>
                          <div className="text-xs text-white/30 font-mono mt-0.5">
                            {tx.category} • {tx.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-sm font-semibold font-mono ${isExpense ? 'text-white/60' : 'text-white'}`}>
                            {isExpense ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1.5 rounded-md text-white/20 hover:text-white/80 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {transactions.length === 0 && (
                <div className="text-center py-12 text-white/30 text-sm">
                  No transactions registered. Add one to begin tracking.
                </div>
              )}
            </div>
          </div>

          {/* Interactive Savings Projections Calculator */}
          <SavingsForecaster />
        </div>

        {/* Right column: Savings Goals & Budgets */}
        <div className="flex flex-col gap-6 w-full">
          {/* Savings Goals Card */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-white/50" />
                <h3 className="font-display font-medium text-white/80 text-sm tracking-wide">
                  Savings Goals
                </h3>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all"
                title="Add Savings Goal"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {goals.map((goal) => {
                  const percent = Math.min(100, (goal.saved / goal.target) * 100);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={goal.id}
                      className="group bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-white/10 hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex justify-between items-center text-xs font-semibold text-white/80">
                        <span>{goal.name}</span>
                        <span className="font-mono">{percent.toFixed(0)}%</span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full mt-2.5 overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-white/30 font-mono mt-2">
                        <span>{formatCurrency(goal.saved)} saved</span>
                        <span>Target: {formatCurrency(goal.target)}</span>
                      </div>

                      {/* Adjust funds inline input */}
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <input
                          type="number"
                          placeholder="Update saved amt..."
                          defaultValue={goal.saved}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) updateGoalSaved(goal.id, val);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-0.5 text-[10px] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all font-mono"
                        />
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1 rounded text-white/20 hover:text-white/80 hover:bg-white/5 shrink-0"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {goals.length === 0 && (
                <div className="text-center py-6 text-white/30 text-xs font-mono">
                  No active goals set.
                </div>
              )}
            </div>
          </div>

          {/* Budget Categories Card */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="font-display font-medium text-white/80 text-sm tracking-wide border-b border-white/5 pb-3">
              Monthly Budgets
            </h3>

            <div className="flex flex-col gap-4">
              {budgets.map((budget, i) => {
                const limit = budget.limit;
                const spent = budget.spent;
                const percent = Math.min(100, limit > 0 ? (spent / limit) * 100 : 0);
                const isOverBudget = spent > limit;
                const isNearLimit = percent >= 80 && spent <= limit;

                return (
                  <div 
                    key={i} 
                    className={cn(
                      "flex flex-col gap-2 p-3.5 rounded-xl border transition-all duration-300",
                      isOverBudget
                        ? "bg-rose-500/5 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.1)]"
                        : isNearLimit
                          ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]"
                          : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-white/80">{budget.category}</span>
                      <span className="font-mono text-white/50">
                        {formatCurrency(spent)} <span className="text-[10px] text-white/30">of {formatCurrency(limit)}</span>
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          isOverBudget
                            ? "bg-gradient-to-r from-red-500 to-rose-500"
                            : isNearLimit
                              ? "bg-gradient-to-r from-amber-400 to-orange-400"
                              : "bg-gradient-to-r from-indigo-500 to-blue-500"
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className={cn(
                        "font-semibold",
                        isOverBudget 
                          ? "text-red-400 animate-pulse" 
                          : isNearLimit 
                            ? "text-amber-400" 
                            : "text-white/30"
                      )}>
                        {isOverBudget ? '🚨 Over Budget!' : isNearLimit ? '⚠️ Warning: Near Limit' : `${percent.toFixed(0)}% Utilized`}
                      </span>
                      {/* Set limit editor */}
                      <div className="flex items-center gap-1">
                        <span className="text-white/20 text-[8px]">Set Limit:</span>
                        <input
                          type="number"
                          placeholder="Limit"
                          defaultValue={limit}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) useFinanceStore.getState().updateBudgetLimit(budget.category, val);
                          }}
                          className="bg-black/25 border border-white/5 rounded px-1 text-right text-white/40 placeholder-white/10 text-[9px] w-[55px] focus:outline-none focus:text-white transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={addTransaction}
      />

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={addGoal}
      />
    </motion.div>
  );
}

function SavingsForecaster() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [interestRate, setInterestRate] = useState(10); // 10% expected return
  const [years, setYears] = useState(15); // 15 years duration

  const dataPoints = useMemo(() => {
    const r = interestRate / 100 / 12; // monthly rate
    const totalMonths = years * 12;
    const points: { month: number; year: number; totalSaved: number; totalInterest: number; totalVal: number }[] = [];
    
    let rawSaved = 0;
    let balance = 0;
    
    for (let m = 1; m <= totalMonths; m++) {
      rawSaved += monthlyDeposit;
      balance = (balance + monthlyDeposit) * (1 + r);
      
      // Save data points yearly, plus first and last month
      if (m === 1 || m % 12 === 0 || m === totalMonths) {
        points.push({
          month: m,
          year: Math.ceil(m / 12),
          totalSaved: Math.round(rawSaved),
          totalInterest: Math.max(0, Math.round(balance - rawSaved)),
          totalVal: Math.round(balance)
        });
      }
    }
    
    return points;
  }, [monthlyDeposit, interestRate, years]);

  const maxVal = dataPoints[dataPoints.length - 1]?.totalVal || 10000;
  
  // SVG coordinates setup
  const svgWidth = 400;
  const svgHeight = 180;
  
  const savedPointsStr = useMemo(() => {
    if (dataPoints.length === 0) return '';
    return dataPoints.map((pt, idx) => {
      const x = (idx / (dataPoints.length - 1)) * svgWidth;
      const y = svgHeight - (pt.totalSaved / maxVal) * (svgHeight - 16) - 8;
      return `${x},${y}`;
    }).join(' ');
  }, [dataPoints, maxVal]);

  const totalPointsStr = useMemo(() => {
    if (dataPoints.length === 0) return '';
    return dataPoints.map((pt, idx) => {
      const x = (idx / (dataPoints.length - 1)) * svgWidth;
      const y = svgHeight - (pt.totalVal / maxVal) * (svgHeight - 16) - 8;
      return `${x},${y}`;
    }).join(' ');
  }, [dataPoints, maxVal]);

  const formatCurrencyINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="font-display font-medium text-white/80 text-sm tracking-wide">
            Savings Projections Calculator
          </h3>
        </div>
        <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Monthly Compounding
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* sliders inputs */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Monthly Deposit</span>
              <span className="font-mono text-white font-bold">{formatCurrencyINR(monthlyDeposit)}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Expected ROI (%)</span>
              <span className="font-mono text-white font-bold">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Duration (Years)</span>
              <span className="font-mono text-white font-bold">{years} years</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

          {/* projection sum panel */}
          <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs space-y-1.5 mt-2">
            <div className="flex justify-between">
              <span className="text-white/40">Total Invested:</span>
              <span className="font-mono text-white/80">{formatCurrencyINR(dataPoints[dataPoints.length - 1]?.totalSaved || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Interest Earned:</span>
              <span className="font-mono text-emerald-400 font-semibold">+{formatCurrencyINR(dataPoints[dataPoints.length - 1]?.totalInterest || 0)}</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-1.5 font-bold">
              <span className="text-white/60">Maturity Value:</span>
              <span className="font-mono text-indigo-300">{formatCurrencyINR(dataPoints[dataPoints.length - 1]?.totalVal || 0)}</span>
            </div>
          </div>
        </div>

        {/* projection curve vis */}
        <div className="flex flex-col gap-4">
          <div className="h-[180px] w-full relative bg-black/20 rounded-xl border border-white/5 p-2 overflow-hidden">
            {dataPoints.length > 1 && (
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="interestGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.2)" />
                    <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                  </linearGradient>
                </defs>

                {/* center dashed lines */}
                <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* shaded area under curve */}
                <path
                  fill="url(#interestGrowthGrad)"
                  d={`M0,${svgHeight} L${totalPointsStr.replace(/,/g, ' ')} L${svgWidth},${svgHeight} Z`}
                />

                {/* raw savings line */}
                <polyline
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  points={savedPointsStr}
                />

                {/* total accrued value line */}
                <polyline
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="3"
                  points={totalPointsStr}
                />

                {/* end glow circle */}
                {(() => {
                  if (dataPoints.length === 0) return null;
                  const endPt = dataPoints[dataPoints.length - 1];
                  const x = svgWidth;
                  const y = svgHeight - (endPt.totalVal / maxVal) * (svgHeight - 16) - 8;
                  return (
                    <g>
                      <circle cx={x - 2} cy={y} r="4.5" fill="#818cf8" />
                      <circle cx={x - 2} cy={y} r="9" fill="rgba(129,140,248,0.25)" className="animate-pulse" />
                    </g>
                  );
                })()}
              </svg>
            )}

            {/* floating max/min labels */}
            <div className="absolute top-2 left-2 text-[8px] font-mono text-white/30 flex flex-col">
              <span>Max: {formatCurrencyINR(maxVal)}</span>
              <span>Min: {formatCurrencyINR(monthlyDeposit)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-[10px] text-white/40 font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 border-t border-dashed border-white/45 animate-pulse" />
              <span>Invested Capital</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-indigo-400" />
              <span>Interest Accumulation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
