// components/shared/notifications/NotificationBadge.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  className,
  variant = 'destructive',
  size = 'md',
}) => {
  const displayCount = count > max ? `${max}+` : count;

  const sizeClasses = {
    sm: 'h-4 min-w-[16px] text-[10px] px-0.5',
    md: 'h-5 min-w-[20px] text-xs px-1',
    lg: 'h-6 min-w-[24px] text-sm px-1.5',
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border border-border bg-background text-foreground',
  };

  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'absolute -right-1 -top-1 flex items-center justify-center rounded-full font-semibold shadow-sm',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        {displayCount}
      </motion.span>
    </AnimatePresence>
  );
};