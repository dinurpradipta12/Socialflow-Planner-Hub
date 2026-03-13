import { motion, HTMLMotionProps } from 'motion/react';
import React, { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function Button({ variant = 'primary', children, icon, className = '', ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0
        ${isPrimary 
          ? 'bg-gradient-to-r from-accent to-accent-secondary text-white shadow-sm hover:shadow-accent-lg hover:brightness-110' 
          : isSecondary
          ? 'bg-transparent border border-border text-foreground hover:bg-muted hover:border-accent/30 hover:shadow-md'
          : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}
        ${className}
      `}
      {...props}
    >
      {children}
      {icon && (
        <span className={`flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1 ${isPrimary ? 'text-white' : 'text-current'}`}>
          {icon}
        </span>
      )}
    </motion.button>
  );
}
