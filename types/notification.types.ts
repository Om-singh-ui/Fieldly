// types/notification.types.ts
export type NotificationType = 
  | 'SYSTEM'
  | 'LEASE'
  | 'PAYMENT'
  | 'MESSAGE'
  | 'LISTING'
  | 'BID'
  | 'REVIEW'
  | 'APPLICATION'
  | 'REMINDER';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date | null;
  actionUrl?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface NotificationTypePreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  types: Record<NotificationType, NotificationTypePreferences>;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export interface UnreadCountResponse {
  count: number;
}