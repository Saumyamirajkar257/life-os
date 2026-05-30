'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Fatal Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex items-center justify-center font-sans p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Fatal System Error</h1>
          <p className="text-zinc-400 text-sm mb-6">
            The application encountered a critical error at the root level.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Hard Reboot
          </button>
        </div>
      </body>
    </html>
  );
}
