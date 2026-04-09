// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    // Find the user in our database using clerkUserId
    const user = await prisma.user.findUnique({
      where: { clerkUserId: session.userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = {
      userId: user.id,
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

    const response = NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
      },
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

// ADD THIS POST METHOD
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the database user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: session.userId },
      select: { id: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    
    console.log('📝 Creating notification for user:', user.id);

    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        type: body.type || 'SYSTEM',
        title: body.title,
        message: body.message,
        actionUrl: body.actionUrl,
        entityType: body.entityType,
        entityId: body.entityId,
      },
    });

    console.log('✅ Notification created:', notification.id);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}