// components/shared/notifications/skeletons/NotificationListSkeleton.tsx
'use client';

import React from 'react';
import { NotificationSkeleton } from './NotificationSkeleton';

export const NotificationListSkeleton: React.FC = () => {
  return (
    <div className="divide-y divide-border">
      <NotificationSkeleton index={0} />
      <NotificationSkeleton index={1} />
      <NotificationSkeleton index={2} />
      <NotificationSkeleton index={3} />
      <NotificationSkeleton index={4} />
    </div>
  );
};

export default NotificationListSkeleton;