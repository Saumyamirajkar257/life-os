/**
 * @file AccountModal.tsx
 * @description Modal dialog for creating and editing financial accounts.
 * @module Features/Finance/Components/Accounts
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import { AccountType } from '../../types/finance.types';
import { validateAccount } from '../../validation/financeValidation';

export const AccountModal: React.FC = () => {
  const { activeModal, editingAccount, closeModal, createAccount, updateAccount } = useFinance();

  const [name, setName] = useState<string>('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState<string>('');
  const [institution, setInstitution] = useState<string>('');
  const [accountNumberLast4, setAccountNumberLast4] = useState<string>('');
  const [creditLimit, setCreditLimit] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingAccount) {
      setName(editingAccount.name);
      setType(editingAccount.type);
      setBalance(editingAccount.balance.toString());
      setInstitution(editingAccount.institution || '');
      setAccountNumberLast4(editingAccount.accountNumberLast4 || '');
      setCreditLimit(editingAccount.creditLimit ? editingAccount.creditLimit.toString() : '');
      setInterestRate(editingAccount.interestRate ? editingAccount.interestRate.toString() : '');
    } else {
      setName('');
      setType('bank');
      setBalance('');
      setInstitution('');
      setAccountNumberLast4('');
      setCreditLimit('');
      setInterestRate('');
    }
    setErrors({});
  }, [editingAccount, activeModal]);

  if (activeModal !== 'account') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericBalance = parseFloat(balance);
    const payload = {
      name: name.trim(),
      type,
      balance: isNaN(numericBalance) ? 0 : numericBalance,
      institution: institution.trim(),
      accountNumberLast4: accountNumberLast4.trim(),
      creditLimit: creditLimit ? parseFloat(creditLimit) : undefined,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
    };

    const validation = validateAccount(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editingAccount) {
      updateAccount(editingAccount.id, payload);
    } else {
      createAccount(payload);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {editingAccount ? 'Edit Account' : 'Connect New Account'}
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
            <label className="block font-semibold text-slate-300 mb-1">Account Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chase Premier Checking"
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-rose-400 text-[10px] mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              >
                <option value="bank">Bank / Checking</option>
                <option value="savings">High-Yield Savings</option>
                <option value="credit_card">Credit Card</option>
                <option value="investment">Brokerage / Investment</option>
                <option value="cash">Physical Cash</option>
                <option value="digital_wallet">Digital Wallet</option>
                <option value="crypto">Crypto Wallet</option>
                <option value="custom">Custom Account</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Balance ($)</label>
              <input
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.balance && <p className="text-rose-400 text-[10px] mt-1">{errors.balance}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Chase, Marcus"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Last 4 Digits</label>
              <input
                type="text"
                maxLength={4}
                value={accountNumberLast4}
                onChange={(e) => setAccountNumberLast4(e.target.value)}
                placeholder="4892"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {type === 'credit_card' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Credit Limit ($)</label>
              <input
                type="number"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
              />
            </div>
          )}

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
              id="btn-submit-account-modal"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              {editingAccount ? 'Save Changes' : 'Connect Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
