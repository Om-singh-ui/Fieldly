// actions/notifications/getNotifications.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getNotifications = cache(async ({
  page = 1,
  limit = 20,
  unreadOnly = false,
}: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
} = {}) => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(unreadOnly && { isRead: false }),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
      },
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      notifications: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
      },
    };
  }
});

export async function getUnreadNotificationCount() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { count: 0 };
    }

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return { count: 0 };
  }
}