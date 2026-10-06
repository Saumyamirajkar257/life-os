/**
 * @file SocialAuthButton.tsx
 * @description Button for Google OAuth sign-in with clean visual styling and loading indicator.
 * @module Features/Auth/Components/SocialAuthButton
 */

import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialAuthButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
}

export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  label = 'Continue with Google',
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center gap-3 border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] font-medium h-11 transition-all cursor-pointer"
    >
      {!isLoading && (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.0 10.04.0 12c0 1.96.46 3.8 1.27 5.42l4.01-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24.0 12 .0 7.31.0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      )}
      <span>{label}</span>
    </Button>
  );
};
