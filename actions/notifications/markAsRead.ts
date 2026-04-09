// actions/notifications/markAsRead.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId, // Ensure user owns the notification
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath('/api/notifications');
    
    return { success: true, notification };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

export async function markMultipleAsRead(notificationIds: string[]) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const result = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath('/api/notifications');
    
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Error marking multiple notifications as read:', error);
    return { success: false, error: 'Failed to mark notifications as read' };
  }
}