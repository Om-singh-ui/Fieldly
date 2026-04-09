// store/notificationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '@/types/notification.types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  lastFetched: Date | null;
  addNotification: (notification: Notification) => void;
  addNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updateUnreadCount: (count: number) => void;
  setLastFetched: (date: Date) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      lastFetched: null,

      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
        }));
      },

      addNotifications: (notifications) => {
        set((state) => {
          const existingIds = new Set(state.notifications.map(n => n.id));
          const newNotifications = notifications.filter(n => !existingIds.has(n.id));
          
          return {
            notifications: [...state.notifications, ...newNotifications],
            unreadCount: state.notifications.filter(n => !n.isRead).length,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          
          if (notification && !notification.isRead) {
            return {
              notifications: state.notifications.map(n =>
                n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
              ),
              unreadCount: Math.max(0, state.unreadCount - 1),
            };
          }
          
          return state;
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({
            ...n,
            isRead: true,
            readAt: n.readAt || new Date(),
          })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          
          return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: notification && !notification.isRead 
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
          lastFetched: null,
        });
      },

      updateUnreadCount: (count) => {
        set({ unreadCount: count });
      },

      setLastFetched: (date) => {
        set({ lastFetched: date });
      }
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 50),
        unreadCount: state.unreadCount,
        lastFetched: state.lastFetched,
      }),
    }
  )
);