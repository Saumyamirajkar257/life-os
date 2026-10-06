/**
 * @file financeValidation.ts
 * @description Input validation hooks and helper guards for financial forms.
 * @module Features/Finance/Validation
 */

import { Account, Transaction, Budget, Bill, SavingsGoal } from '../types/finance.types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateAccount(payload: Partial<Account>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!payload.name || payload.name.trim().length === 0) {
    errors.name = 'Account name is required.';
  } else if (payload.name.length > 100) {
    errors.name = 'Account name cannot exceed 100 characters.';
  }

  if (!payload.type) {
    errors.type = 'Account type is required.';
  }

  if (payload.balance === undefined || isNaN(payload.balance)) {
    errors.balance = 'Valid numeric balance is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateTransaction(payload: Partial<Transaction>): ValidationResult {
  const errors: Record<string, string> = {};

  if (payload.amount === undefined || isNaN(payload.amount) || payload.amount <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  }

  if (!payload.type) {
    errors.type = 'Transaction type is required.';
  }

  if (!payload.category || payload.category.trim().length === 0) {
    errors.category = 'Category is required.';
  }

  if (!payload.accountId) {
    errors.accountId = 'Account selection is required.';
  }

  if (payload.type === 'transfer' && !payload.targetAccountId) {
    errors.targetAccountId = 'Destination account is required for transfers.';
  }

  if (payload.type === 'transfer' && payload.accountId === payload.targetAccountId) {
    errors.targetAccountId = 'Source and destination accounts must be different.';
  }

  if (!payload.date) {
    errors.date = 'Date is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateBudget(payload: Partial<Budget>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!payload.name || payload.name.trim().length === 0) {
    errors.name = 'Budget name is required.';
  }

  if (!payload.category) {
    errors.category = 'Category is required.';
  }

  if (!payload.amountLimit || payload.amountLimit <= 0) {
    errors.amountLimit = 'Budget limit must be greater than zero.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateBill(payload: Partial<Bill>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!payload.title || payload.title.trim().length === 0) {
    errors.title = 'Bill title is required.';
  }

  if (!payload.amount || payload.amount <= 0) {
    errors.amount = 'Bill amount must be greater than zero.';
  }

  if (!payload.dueDate) {
    errors.dueDate = 'Due date is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSavingsGoal(payload: Partial<SavingsGoal>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!payload.name || payload.name.trim().length === 0) {
    errors.name = 'Goal name is required.';
  }

  if (!payload.targetAmount || payload.targetAmount <= 0) {
    errors.targetAmount = 'Target amount must be greater than zero.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
