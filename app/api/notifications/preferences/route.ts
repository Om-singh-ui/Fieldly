// app/api/notifications/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import type { NotificationType } from '@/types/notification.types';

// Fix for Zod v4 - use z.record with proper shape
const preferencesSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
  types: z.record(
    z.string(),
    z.object({
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
    })
  ),
});

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const defaultPreferences = {
      email: true,
      push: true,
      sms: false,
      types: {
        SYSTEM: { email: true, push: true, sms: false },
        LEASE: { email: true, push: true, sms: true },
        PAYMENT: { email: true, push: true, sms: true },
        MESSAGE: { email: true, push: true, sms: false },
        LISTING: { email: true, push: true, sms: false },
        BID: { email: true, push: true, sms: true },
        REVIEW: { email: false, push: true, sms: false },
        APPLICATION: { email: true, push: true, sms: true },
        REMINDER: { email: true, push: true, sms: true },
      } as Record<NotificationType, { email: boolean; push: boolean; sms: boolean }>,
    };

    return NextResponse.json(defaultPreferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const preferences = preferencesSchema.parse(body);

    return NextResponse.json(preferences);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid preferences data', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}