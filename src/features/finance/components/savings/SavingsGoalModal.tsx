/**
 * @file SavingsGoalModal.tsx
 * @description Modal dialog for creating and editing savings goals.
 * @module Features/Finance/Components/Savings
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import { validateSavingsGoal } from '../../validation/financeValidation';

export const SavingsGoalModal: React.FC = () => {
  const { activeModal, editingSavingsGoal, closeModal, createSavingsGoal, updateSavingsGoal, accounts } =
    useFinance();

  const [name, setName] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [currentAmount, setCurrentAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Emergency Fund');
  const [targetDate, setTargetDate] = useState<string>('2027-12-31');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingSavingsGoal) {
      setName(editingSavingsGoal.name);
      setTargetAmount(editingSavingsGoal.targetAmount.toString());
      setCurrentAmount(editingSavingsGoal.currentAmount.toString());
      setCategory(editingSavingsGoal.category);
      setTargetDate(editingSavingsGoal.targetDate);
      setMonthlyContribution(editingSavingsGoal.monthlyContribution?.toString() || '');
      setAccountId(editingSavingsGoal.accountId || accounts[0]?.id || '');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setCategory('Emergency Fund');
      setTargetDate('2027-12-31');
      setMonthlyContribution('');
      setAccountId(accounts[0]?.id || '');
    }
    setErrors({});
  }, [editingSavingsGoal, accounts, activeModal]);

  if (activeModal !== 'savings_goal') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const targetNum = parseFloat(targetAmount);
    const currentNum = parseFloat(currentAmount);
    const payload = {
      name: name.trim(),
      targetAmount: isNaN(targetNum) ? 0 : targetNum,
      currentAmount: isNaN(currentNum) ? 0 : currentNum,
      category,
      targetDate,
      monthlyContribution: monthlyContribution ? parseFloat(monthlyContribution) : undefined,
      accountId,
    };

    const validation = validateSavingsGoal(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editingSavingsGoal) {
      updateSavingsGoal(editingSavingsGoal.id, payload);
    } else {
      createSavingsGoal(payload);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {editingSavingsGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
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
            <label className="block font-semibold text-slate-300 mb-1">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emergency Cushion, Tokyo Vacation"
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-rose-400 text-[10px] mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Amount ($)</label>
              <input
                type="number"
                step="100"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="10000"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.targetAmount && <p className="text-rose-400 text-[10px] mt-1">{errors.targetAmount}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Current Saved ($)</label>
              <input
                type="number"
                step="10"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="2500"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              >
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Vacation Fund">Vacation Fund</option>
                <option value="House Down Payment">House Down Payment</option>
                <option value="Vehicle Purchase">Vehicle Purchase</option>
                <option value="Custom Savings">Custom Savings</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Dedicated Savings Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
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
              id="btn-submit-goal-modal"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              {editingSavingsGoal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
