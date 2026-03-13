import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-medium text-foreground ml-1">
        {label}
      </label>
      <input
        ref={ref}
        className={`
          w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm text-foreground
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:border-transparent transition-all duration-200
          placeholder:text-muted-foreground/50
          hover:border-accent/30
          ${className}
        `}
        {...props}
      />
    </div>
  );
});
