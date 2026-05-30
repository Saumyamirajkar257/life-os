import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  searchIcon?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, searchIcon, ...props }, ref) => {
    if (searchIcon) {
      return (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-xl bg-white/5 pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30',
              'border border-white/10 backdrop-blur-sm',
              'focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20',
              'transition-all duration-200',
              className
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30',
          'border border-white/10 backdrop-blur-sm',
          'focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20',
          'transition-all duration-200',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
