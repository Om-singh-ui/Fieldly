// services/notifications/preferenceService.ts
import type { NotificationPreferences } from '@/types/notification.types';

const API_BASE = '/api/notifications/preferences';

class PreferenceService {
  async getPreferences(): Promise<NotificationPreferences> {
    const response = await fetch(API_BASE);
    
    if (!response.ok) {
      throw new Error('Failed to fetch notification preferences');
    }

    return response.json();
  }

  async updatePreferences(
    userId: string, 
    preferences: NotificationPreferences
  ): Promise<NotificationPreferences> {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to update notification preferences');
    }

    return response.json();
  }
}

export const preferenceService = new PreferenceService();