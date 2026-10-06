/**
 * @file BudgetModal.tsx
 * @description Modal dialog for creating and editing category budgets.
 * @module Features/Finance/Components/Budgets
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import { TRANSACTION_CATEGORIES } from '../../constants/financeConstants';
import { validateBudget } from '../../validation/financeValidation';

export const BudgetModal: React.FC = () => {
  const { activeModal, editingBudget, closeModal, createBudget, updateBudget } = useFinance();

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Food & Dining');
  const [amountLimit, setAmountLimit] = useState<string>('');
  const [alertThresholdPercent, setAlertThresholdPercent] = useState<number>(80);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingBudget) {
      setName(editingBudget.name);
      setCategory(editingBudget.category);
      setAmountLimit(editingBudget.amountLimit.toString());
      setAlertThresholdPercent(editingBudget.alertThresholdPercent || 80);
    } else {
      setName('');
      setCategory('Food & Dining');
      setAmountLimit('');
      setAlertThresholdPercent(80);
    }
    setErrors({});
  }, [editingBudget, activeModal]);

  if (activeModal !== 'budget') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const limitNum = parseFloat(amountLimit);
    const payload = {
      name: name.trim() || category,
      category,
      amountLimit: isNaN(limitNum) ? 0 : limitNum,
      alertThresholdPercent,
      period: 'monthly' as const,
    };

    const validation = validateBudget(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editingBudget) {
      updateBudget(editingBudget.id, payload);
    } else {
      createBudget(payload);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {editingBudget ? 'Edit Budget' : 'Set Category Budget'}
          </h3>
          <button
            onClick={closeModal}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Budget Label</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dining out & Coffee"
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-rose-400 text-[10px] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Target Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
            >
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Monthly Limit ($)</label>
            <input
              type="number"
              step="10"
              value={amountLimit}
              onChange={(e) => setAmountLimit(e.target.value)}
              placeholder="600"
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.amountLimit && <p className="text-rose-400 text-[10px] mt-1">{errors.amountLimit}</p>}
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Warning Alert Threshold ({alertThresholdPercent}%)
            </label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={alertThresholdPercent}
              onChange={(e) => setAlertThresholdPercent(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-budget-modal"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              {editingBudget ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
