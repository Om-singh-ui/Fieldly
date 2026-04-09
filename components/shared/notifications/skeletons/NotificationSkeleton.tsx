// components/shared/notifications/skeletons/NotificationSkeleton.tsx
'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface NotificationSkeletonProps {
  index?: number;
  className?: string;
}

export const NotificationSkeleton: React.FC<NotificationSkeletonProps> = ({
  index = 0,
  className,
}) => {
  return (
    <div 
      className={cn('p-4 space-y-3', className)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSkeleton;