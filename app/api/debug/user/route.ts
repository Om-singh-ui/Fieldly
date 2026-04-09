// app/api/debug/user/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: session.userId },
      select: { 
        id: true, 
        clerkUserId: true, 
        name: true, 
        role: true,
        email: true
      }
    });

    // Get all notifications for this user
    const notifications = await prisma.notification.findMany({
      where: { userId: dbUser?.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get all users in the system
    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true, role: true },
      take: 10
    });

    return NextResponse.json({
      session: {
        clerkUserId: session.userId,
      },
      dbUser,
      notificationCount: notifications.length,
      recentNotifications: notifications,
      allUsers: allUsers,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}