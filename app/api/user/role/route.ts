// app/api/user/role/route.ts
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ 
        role: null, 
        userId: null,
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { 
        id: true,
        role: true,
        name: true
      }
    })
    
    return NextResponse.json({ 
      role: user?.role || null,
      userId: user?.id || null,
      name: user?.name || null
    })
  } catch (error) {
    console.error('[USER_ROLE_API]', error)
    return NextResponse.json({ 
      role: null, 
      userId: null,
      error: 'Internal server error' 
    }, { status: 500 })
  }
}