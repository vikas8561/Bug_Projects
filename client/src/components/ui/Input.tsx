import { forwardRef, type InputHTMLAttributes, useEffect } from 'react';
import { cn } from './Button';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    
    // BUG-003 INJECTED: 
    // React Memory Leak: We add a 'resize' event listener to the window every time 
    // an Input mounts, but we do NOT return a cleanup function to remove it.
    // If a page with 10 inputs unmounts and remounts 50 times, we get 500 orphaned listeners.
    useEffect(() => {
      const handleResize = () => {
        // dummy heavy computation
        Array(1000).fill(0).map(() => Math.random());
      };
      window.addEventListener('resize', handleResize);
    }, []);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 animate-pulse">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
