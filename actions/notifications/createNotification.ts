// actions/notifications/createNotification.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// 🔧 FIX: Make actionUrl accept relative paths
const createNotificationSchema = z.object({
  userId: z.string(),
  type: z.enum([
    'SYSTEM', 'LEASE', 'PAYMENT', 'MESSAGE', 
    'LISTING', 'BID', 'REVIEW', 'APPLICATION', 'REMINDER'
  ] as const),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  // 🔧 FIX: Use string() instead of url() to allow relative paths
  actionUrl: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'] as const).default('MEDIUM'),
});

type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

export async function createNotification(input: CreateNotificationInput) {
  try {
    const { userId: authUserId } = await auth();
    
    if (!authUserId) {
      throw new Error('Unauthorized');
    }

    const validated = createNotificationSchema.parse(input);

    const notification = await prisma.notification.create({
      data: {
        userId: validated.userId,
        type: validated.type,
        title: validated.title,
        message: validated.message,
        actionUrl: validated.actionUrl,
        entityType: validated.entityType,
        entityId: validated.entityId,
      },
    });

    revalidatePath('/api/notifications');
    
    return { success: true, notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

export async function createBulkNotifications(
  notifications: CreateNotificationInput[]
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const validated = notifications.map(n => createNotificationSchema.parse(n));

    const created = await prisma.notification.createMany({
      data: validated.map(n => ({
        userId: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        actionUrl: n.actionUrl,
        entityType: n.entityType,
        entityId: n.entityId,
      })),
    });

    revalidatePath('/api/notifications');
    
    return { success: true, count: created.count };
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    return { success: false, error: 'Failed to create notifications' };
  }
}