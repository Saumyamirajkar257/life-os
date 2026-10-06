/**
 * @file BillModal.tsx
 * @description Modal dialog for creating and editing bills.
 * @module Features/Finance/Components/Bills
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import { TRANSACTION_CATEGORIES } from '../../constants/financeConstants';
import { validateBill } from '../../validation/financeValidation';

export const BillModal: React.FC = () => {
  const { activeModal, editingBill, closeModal, createBill, updateBill, accounts } = useFinance();

  const [title, setTitle] = useState<string>('');
  const [payee, setPayee] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Utilities & Bills');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [accountId, setAccountId] = useState<string>('');
  const [autoPay, setAutoPay] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingBill) {
      setTitle(editingBill.title);
      setPayee(editingBill.payee);
      setAmount(editingBill.amount.toString());
      setCategory(editingBill.category);
      setDueDate(editingBill.dueDate);
      setAccountId(editingBill.accountId || accounts[0]?.id || '');
      setAutoPay(editingBill.autoPay || false);
    } else {
      setTitle('');
      setPayee('');
      setAmount('');
      setCategory('Utilities & Bills');
      setDueDate(new Date().toISOString().slice(0, 10));
      setAccountId(accounts[0]?.id || '');
      setAutoPay(false);
    }
    setErrors({});
  }, [editingBill, accounts, activeModal]);

  if (activeModal !== 'bill') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    const payload = {
      title: title.trim(),
      payee: payee.trim() || title.trim(),
      amount: isNaN(amountNum) ? 0 : amountNum,
      category,
      dueDate,
      accountId,
      autoPay,
      recurrence: 'monthly' as const,
      status: 'unpaid' as const,
    };

    const validation = validateBill(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editingBill) {
      updateBill(editingBill.id, payload);
    } else {
      createBill(payload);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {editingBill ? 'Edit Bill' : 'Schedule New Bill'}
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
            <label className="block font-semibold text-slate-300 mb-1">Bill Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fiber Internet, Gym Membership"
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && <p className="text-rose-400 text-[10px] mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Payee Vendor</label>
              <input
                type="text"
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                placeholder="Sonic, Equinox"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="89.99"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.amount && <p className="text-rose-400 text-[10px] mt-1">{errors.amount}</p>}
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
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Payment Account</label>
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="chk-autopay"
              checked={autoPay}
              onChange={(e) => setAutoPay(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <label htmlFor="chk-autopay" className="text-slate-300 font-medium cursor-pointer">
              Enable AutoPay Reminder
            </label>
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
              id="btn-submit-bill-modal"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              {editingBill ? 'Save Changes' : 'Schedule Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
