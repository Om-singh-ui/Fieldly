// services/notifications/notificationService.ts
import type { Notification, PaginatedNotifications, UnreadCountResponse } from '@/types/notification.types';

const API_BASE = '/api/notifications';

interface GetNotificationsParams {
  userId?: string;
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  _t?: number; // Cache buster parameter
}

class NotificationService {
  async getNotifications({ 
    page = 1, 
    limit = 20,
    unreadOnly = false,
    _t, // Accept cache buster
  }: GetNotificationsParams = {}): Promise<PaginatedNotifications> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(unreadOnly && { unreadOnly: 'true' }),
    });

    // Add cache buster if provided
    if (_t) {
      params.append('_t', _t.toString());
    }

    const response = await fetch(`${API_BASE}?${params}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  }

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await fetch(`${API_BASE}/count`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    return response.json();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await fetch(`${API_BASE}/${notificationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: true }),
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  }

  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${API_BASE}/mark-all-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  }

  async createNotification(data: Partial<Notification>): Promise<Notification> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    return response.json();
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${notificationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  }
}

export const notificationService = new NotificationService();