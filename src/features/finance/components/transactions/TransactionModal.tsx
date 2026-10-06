/**
 * @file TransactionModal.tsx
 * @description Modal form for creating and editing financial transactions and transfers.
 * @module Features/Finance/Components/Transactions
 */

import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownRight, ArrowLeftRight, Check } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import { TRANSACTION_CATEGORIES, PAYMENT_METHODS } from '../../constants/financeConstants';
import { validateTransaction } from '../../validation/financeValidation';

export const TransactionModal: React.FC = () => {
  const { activeModal, editingTransaction, closeModal, createTransaction, updateTransaction, accounts } =
    useFinance();

  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [category, setCategory] = useState<string>('Groceries');
  const [subcategory, setSubcategory] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [targetAccountId, setTargetAccountId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [notes, setNotes] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setMerchant(editingTransaction.merchant);
      setCategory(editingTransaction.category);
      setSubcategory(editingTransaction.subcategory || '');
      setAccountId(editingTransaction.accountId);
      setTargetAccountId(editingTransaction.targetAccountId || '');
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);
      setNotes(editingTransaction.notes || '');
      setTags(editingTransaction.tags.join(', '));
      setIsRecurring(editingTransaction.isRecurring || false);
    } else {
      setType('expense');
      setAmount('');
      setMerchant('');
      setCategory('Groceries');
      setSubcategory('');
      setAccountId(accounts[0]?.id || '');
      setTargetAccountId(accounts[1]?.id || '');
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('Credit Card');
      setNotes('');
      setTags('');
      setIsRecurring(false);
    }
    setErrors({});
  }, [editingTransaction, accounts, activeModal]);

  if (activeModal !== 'transaction') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      type,
      amount: numericAmount,
      merchant: merchant.trim(),
      category: type === 'transfer' ? 'Internal Transfer' : category,
      subcategory,
      accountId,
      targetAccountId: type === 'transfer' ? targetAccountId : undefined,
      date,
      paymentMethod,
      notes,
      tags: parsedTags,
      isRecurring,
    };

    const validation = validateTransaction(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload);
    } else {
      createTransaction(payload);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {editingTransaction ? 'Edit Transaction' : 'Record Transaction'}
          </h3>
          <button
            onClick={closeModal}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Type Selector Pills */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Expense</span>
            </button>

            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Income</span>
            </button>

            <button
              type="button"
              onClick={() => setType('transfer')}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                type === 'transfer'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Transfer</span>
            </button>
          </div>

          {/* Amount & Merchant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.amount && <p className="text-rose-400 text-[10px] mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Merchant / Payee</label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Whole Foods, Apple"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Accounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                {type === 'transfer' ? 'From Account' : 'Account'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (${acc.balance.toFixed(2)})
                  </option>
                ))}
              </select>
              {errors.accountId && <p className="text-rose-400 text-[10px] mt-1">{errors.accountId}</p>}
            </div>

            {type === 'transfer' ? (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">To Destination Account</label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (${acc.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
                {errors.targetAccountId && (
                  <p className="text-rose-400 text-[10px] mt-1">{errors.targetAccountId}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
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
            )}
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Work, Tax, Dinner"
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Notes / Description</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes or details..."
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
            />
          </div>

          {/* Submit */}
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
              id="btn-submit-tx-modal"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              {editingTransaction ? 'Save Changes' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
