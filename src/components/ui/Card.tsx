import { motion } from 'motion/react';
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'featured';
  icon?: ReactNode;
  onClick?: () => void;
  key?: React.Key;
}

export function Card({ children, className = '', variant = 'default', icon, onClick }: CardProps) {
  const isInteractive = !!onClick;

  const baseClass = "relative w-full text-left bg-card rounded-2xl p-6 md:p-8 transition-all duration-300";
  
  let variantClass = "";
  if (variant === 'default') {
    variantClass = "border border-border shadow-md";
    if (isInteractive) variantClass += " hover:shadow-xl hover:-translate-y-1";
  } else if (variant === 'elevated') {
    variantClass = "border border-border shadow-lg";
    if (isInteractive) variantClass += " hover:shadow-accent-lg hover:-translate-y-1";
  }

  const content = (
    <>
      {icon && (
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-secondary text-white shadow-accent">
          {icon}
        </div>
      )}
      {children}
      
      {/* Subtle hover gradient overlay for interactive cards */}
      {isInteractive && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </>
  );

  // Featured variant uses the gradient border wrapper
  if (variant === 'featured') {
    const featuredWrapper = `rounded-2xl bg-gradient-to-br from-accent via-accent-secondary to-accent p-[2px] ${isInteractive ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-accent-lg' : 'shadow-accent-lg'} ${className}`;
    
    if (isInteractive) {
      return (
        <motion.button 
          onClick={onClick}
          whileTap={{ scale: 0.98 }}
          className={`group text-left w-full ${featuredWrapper}`}
        >
          <div className="relative h-full w-full rounded-[calc(16px-2px)] bg-card p-6 md:p-8">
            {content}
          </div>
        </motion.button>
      );
    }
    
    return (
      <div className={featuredWrapper}>
        <div className="relative h-full w-full rounded-[calc(16px-2px)] bg-card p-6 md:p-8">
          {content}
        </div>
      </div>
    );
  }

  // Default and Elevated variants
  if (isInteractive) {
    return (
      <motion.button 
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className={`group ${baseClass} ${variantClass} ${className}`}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <div className={`${baseClass} ${variantClass} ${className}`}>
      {content}
    </div>
  );
}
