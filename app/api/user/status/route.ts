  // app/api/user/status/route.ts
  import { NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';
  import { auth } from '@clerk/nextjs/server';

  export async function GET() {
    try {
      const { userId } = await auth();
      
      if (!userId) {
        return NextResponse.json({ 
          error: 'Unauthorized',
          needsAuth: true 
        }, { status: 401 });
      }

      // Find user in database
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        include: {
          farmerProfile: true,
          landownerProfile: true,
        },
      });

      // Return user status without creating if not exists
      if (!user) {
        return NextResponse.json({
          user: null,
          exists: false,
          needsOnboarding: true,
          status: 'needs_role'
        });
      }

      return NextResponse.json({
        user: {
          id: user.id,
          clerkId: user.clerkUserId,
          name: user.name || '',
          email: user.email || '',
          role: user.role,
          isOnboarded: user.isOnboarded,
          hasFarmerProfile: !!user.farmerProfile,
          hasLandownerProfile: !!user.landownerProfile,
        },
        exists: true,
        needsOnboarding: !user.role || !user.isOnboarded,
        status: user.role && user.isOnboarded ? 'complete' : 
                user.role && !user.isOnboarded ? 'needs_profile' : 
                'needs_role'
      });
      
    } catch (error) {
      console.error('Error in user status API:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }