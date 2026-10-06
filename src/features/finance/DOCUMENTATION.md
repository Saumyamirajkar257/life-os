# Milestone 17 — Finance & Wealth Management Module Documentation

## 1. Overview & Goal
The **Finance & Wealth Management Module** is Aura OS's personal finance operating system inspired by Monarch Money, Copilot Money, YNAB, and Apple Wallet. It unifies multi-account tracking, automated net worth calculations, monthly category budgets, bill payment reminders, savings goal velocity, and income/expense analytics into a desktop-first design system.

---

## 2. Feature Architecture & Directory Structure

```
src/features/finance/
├── charts/
│   ├── BudgetProgressChart.tsx      # Category budget progress bar visualizer
│   ├── CashFlowChart.tsx            # Monthly income vs expense bar chart
│   ├── CategorySpendingChart.tsx    # Interactive donut breakdown of expenses
│   ├── IncomeVsExpenseChart.tsx     # Area comparison chart
│   ├── NetWorthChart.tsx            # Historical net worth area trend chart
│   └── SavingsGrowthChart.tsx       # Target velocity & contribution chart
├── components/
│   ├── accounts/
│   │   ├── AccountCard.tsx          # Account card with institution icon & quick actions
│   │   ├── AccountList.tsx          # Multi-account grid overview
│   │   └── AccountModal.tsx         # Add/edit checking, savings, credit card, investment modal
│   ├── bills/
│   │   ├── BillCard.tsx             # Bill card with due status & one-click payment
│   │   ├── BillList.tsx             # Recurring bills & subscription manager
│   │   └── BillModal.tsx            # Schedule recurring bill modal
│   ├── budgets/
│   │   ├── BudgetCard.tsx           # Category budget card with alert thresholds
│   │   ├── BudgetList.tsx           # Monthly budgets grid
│   │   └── BudgetModal.tsx          # Create/edit spending limit target modal
│   ├── dashboard/
│   │   ├── BudgetOverviewWidget.tsx # Dashboard widget for active budgets
│   │   ├── CashFlowSummaryCard.tsx  # Income, expense, net cash flow card
│   │   ├── FinanceDashboard.tsx     # Master unified dashboard grid
│   │   ├── FinancialHealthScoreCard.tsx # 0-100 financial health engine
│   │   ├── InsightsWidget.tsx       # Automated AI financial alerts & tips
│   │   ├── NetWorthCard.tsx         # Total assets, liabilities, net worth card
│   │   ├── RecentTransactionsWidget.tsx # Live ledger feed widget
│   │   └── UpcomingBillsWidget.tsx  # Upcoming 30-day bill deadlines
│   ├── savings/
│   │   ├── SavingsGoalCard.tsx      # Emergency fund & goal progress card
│   │   ├── SavingsGoalList.tsx      # Savings goal buckets grid
│   │   └── SavingsGoalModal.tsx     # Create/edit target savings goal modal
│   └── transactions/
│       ├── TransactionFilterToolbar.tsx # Filter by category, account, type, search, date
│       ├── TransactionList.tsx      # Searchable, filterable transaction ledger
│       ├── TransactionModal.tsx     # Income, expense, and transfer recording modal
│       └── TransactionRow.tsx       # Single transaction row with tag & receipt actions
├── constants/
│   └── financeConstants.ts          # Seed data, categories, default accounts
├── hooks/
│   ├── useFinance.ts                # Primary orchestrator hook
│   ├── useFinanceCalculations.ts    # Memoized net worth, health score, and cash flow math
│   └── useFinanceFilters.ts         # Reactive filtering engine for transactions
├── layouts/
│   └── FinanceLayout.tsx            # Top header, tab navigation bar, viewports, global modals
├── pages/
│   └── FinancePage.tsx              # Primary route entry point
├── reports/
│   └── ReportsView.tsx              # Advanced multi-dimensional analytics view
├── services/
│   └── financeFirestore.service.ts  # Real-time Firestore synchronization service
├── stores/
│   ├── useFinanceAnalyticsStore.ts  # Analytics timeframe and filter state
│   ├── useFinanceStore.ts           # Core persistence store (Zustand + Persist)
│   └── useFinanceUIStore.ts         # Modal and tab navigation UI state
├── types/
│   └── finance.types.ts             # Comprehensive TypeScript models and interfaces
├── utils/
│   └── financeUtils.ts              # Financial calculations & Health Score algorithm
├── validation/
│   └── financeValidation.ts         # Form validation logic
├── DOCUMENTATION.md                 # Complete technical documentation
├── index.ts                         # Public exports
├── module.ts                        # Module SDK registration metadata
└── routes.ts                        # Route definitions
```

---

## 3. Firestore Schema & Security Rules

The Firestore backend uses subcollections under `users/{userId}` to enforce user isolation:

1. **Accounts Collection:** `users/{userId}/finance_accounts/{accountId}`
   - Fields: `name`, `type`, `balance`, `currency`, `institution`, `accountNumberLast4`, `creditLimit`, `interestRate`, `isHidden`, `createdAt`, `updatedAt`
2. **Transactions Collection:** `users/{userId}/finance_transactions/{transactionId}`
   - Fields: `amount`, `type`, `category`, `merchant`, `accountId`, `targetAccountId`, `date`, `paymentMethod`, `notes`, `tags`, `isRecurring`, `isFavorite`, `receiptUrl`
3. **Budgets Collection:** `users/{userId}/finance_budgets/{budgetId}`
   - Fields: `name`, `category`, `amountLimit`, `period`, `alertThresholdPercent`
4. **Bills Collection:** `users/{userId}/finance_bills/{billId}`
   - Fields: `title`, `payee`, `amount`, `dueDate`, `category`, `recurrence`, `status`, `accountId`, `autoPay`
5. **Savings Goals Collection:** `users/{userId}/finance_savings_goals/{goalId}`
   - Fields: `name`, `targetAmount`, `currentAmount`, `category`, `targetDate`, `monthlyContribution`, `accountId`

---

## 4. Financial Health Score Algorithm
Calculated dynamically in `financeUtils.ts` (Range: 0 - 100):
- **Savings Rate Score (Max 30 pts):** Based on `(Income - Expenses) / Income`. 20%+ savings rate grants full 30 points.
- **Liquidity / Emergency Cushion Score (Max 25 pts):** Based on total liquid bank/savings balances covering 3-6 months of expenses.
- **Credit Utilization Score (Max 25 pts):** Calculated as `(Credit Debt) / (Total Credit Limits)`. Under 10% grants full points; >50% incurs penalties.
- **Net Worth Direction (Max 20 pts):** Evaluates positive asset-to-liability balance.

---

## 5. Performance & Accessibility (a11y)
- **Performance:** All metrics (Net Worth, Cash Flow, Category Spending) are computed using `useMemo` in `useFinanceCalculations.ts` to prevent extraneous re-renders during search or filter typing.
- **Accessibility:** All form inputs feature explicit labels and field errors. Buttons use high-contrast text and interactive hover states. Dialogs render backdrop blurs with keyboard escape and click-outside handling.

---

## 6. Technical Debt Assessment
- **Integration:** Plaid / Open Banking API connectors can be integrated in future milestones by swapping out `financeFirestore.service.ts` with Plaid webhook adapters.
- **Multi-Currency Conversion:** Currently defaults to USD ($). Multi-currency FX exchange rates can be hooked into `formatCurrency` in a future update.
