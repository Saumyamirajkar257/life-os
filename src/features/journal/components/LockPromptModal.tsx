/**
 * @file LockPromptModal.tsx
 * @description Password/PIN prompt modal for unlocking private protected journal entries or notes.
 * @module Features/Journal/Components
 */

import React, { useState } from 'react';
import { Lock, KeyRound, X, Check } from 'lucide-react';
import { useJournalUIStore } from '../stores/useJournalUIStore';

export const LockPromptModal: React.FC = () => {
  const { isLockPromptOpen, targetLockedItemId, closeLockPrompt, unlockItem, masterPin } =
    useJournalUIStore();

  const [inputPin, setInputPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLockPromptOpen || !targetLockedItemId) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === masterPin) {
      unlockItem(targetLockedItemId);
      setInputPin('');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect PIN code. Try default PIN "1234".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Private Memory Lock</h3>
              <p className="text-xs text-slate-400">Enter master security PIN to access.</p>
            </div>
          </div>
          <button
            onClick={closeLockPrompt}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Master Security PIN</label>
            <input
              type="password"
              value={inputPin}
              onChange={(e) => {
                setInputPin(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Enter PIN (Default: 1234)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-slate-100 focus:outline-none focus:border-rose-500"
              maxLength={6}
              autoFocus
            />
            {errorMsg && <span className="text-xs text-rose-400 font-semibold">{errorMsg}</span>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeLockPrompt}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
