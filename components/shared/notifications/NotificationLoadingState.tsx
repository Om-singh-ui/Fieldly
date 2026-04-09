// components/shared/notifications/NotificationLoadingState.tsx
'use client';

import React from 'react';
import { NotificationSkeleton } from './skeletons/NotificationSkeleton';

interface NotificationLoadingStateProps {
  count?: number;
}

export const NotificationLoadingState: React.FC<NotificationLoadingStateProps> = ({
  count = 5,
}) => {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: count }).map((_, index) => (
        <NotificationSkeleton key={index} index={index} />
      ))}
    </div>
  );
};