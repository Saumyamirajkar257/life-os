'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.className = `theme-${theme}`;
    }
  }, [theme, mounted]);

  // Track cursor position on hovered glass panels for hover glow border highlights
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.glass-panel') as HTMLElement;
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cheat Code Event Listener for Visual Easter Eggs
  useEffect(() => {
    let inputBuffer = '';
    const codes = {
      cyberpunk: () => {
        useThemeStore.getState().setTheme('cyberpunk');
        triggerFlash('rgba(255, 0, 255, 0.25)');
      },
      hacker: () => {
        useThemeStore.getState().setTheme('hacker');
        triggerFlash('rgba(0, 255, 0, 0.25)');
      },
      minimal: () => {
        useThemeStore.getState().setTheme('minimal-black');
        triggerFlash('rgba(255, 255, 255, 0.15)');
      },
      glass: () => {
        useThemeStore.getState().setTheme('glassmorphism');
        triggerFlash('rgba(255, 255, 255, 0.15)');
      },
      rainbow: () => {
        document.documentElement.classList.toggle('rainbow-active');
        triggerFlash('rgba(255, 255, 0, 0.2)');
      },
      matrix: () => {
        useThemeStore.getState().setTheme('hacker');
        document.documentElement.classList.toggle('rainbow-active');
        triggerFlash('rgba(0, 255, 68, 0.3)');
      }
    };

    const triggerFlash = (color: string) => {
      const flashEl = document.createElement('div');
      flashEl.style.position = 'fixed';
      flashEl.style.inset = '0';
      flashEl.style.backgroundColor = color;
      flashEl.style.zIndex = '99999';
      flashEl.style.pointerEvents = 'none';
      flashEl.style.transition = 'opacity 0.6s ease-out';
      flashEl.style.opacity = '1';
      document.body.appendChild(flashEl);
      
      flashEl.offsetHeight; // Force reflow
      
      flashEl.style.opacity = '0';
      setTimeout(() => {
        flashEl.remove();
      }, 600);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Ignore cheat codes typed inside input boxes/textareas
      }
      if (e.key.length === 1) {
        inputBuffer += e.key.toLowerCase();
        if (inputBuffer.length > 20) {
          inputBuffer = inputBuffer.slice(-20);
        }

        for (const [code, action] of Object.entries(codes)) {
          if (inputBuffer.endsWith(code)) {
            action();
            inputBuffer = '';
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}
