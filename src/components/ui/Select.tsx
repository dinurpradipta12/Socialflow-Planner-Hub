import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, options, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-medium text-foreground ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm text-foreground
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:border-transparent transition-all duration-200
            hover:border-accent/30
            appearance-none cursor-pointer
            ${className}
          `}
          {...props}
        >
          <option value="" disabled className="text-muted-foreground">Pilih {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="text-foreground">{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
});
