// app/api/applications/check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true, role: true }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const searchParams = req.nextUrl.searchParams
    const landId = searchParams.get('landId')
    const listingId = searchParams.get('listingId')
    
    if (!landId && !listingId) {
      return NextResponse.json(
        { error: 'Either landId or listingId is required' },
        { status: 400 }
      )
    }
    
    // Build where clause with proper typing
    const where: Prisma.ApplicationWhereInput = {
      farmerId: user.id,
      status: {
        in: ['PENDING', 'UNDER_REVIEW', 'APPROVED']
      }
    }
    
    if (landId) {
      where.landId = landId
    }
    
    if (listingId) {
      where.listingId = listingId
    }
    
    const existingApplication = await prisma.application.findFirst({
      where,
      select: {
        id: true,
        status: true,
        createdAt: true,
        proposedRent: true,
        duration: true,
        land: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    const applicationCount = await prisma.application.count({
      where: {
        farmerId: user.id,
        status: {
          in: ['PENDING', 'UNDER_REVIEW']
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })
    
    const MAX_PENDING_APPLICATIONS = 10
    
    return NextResponse.json({
      hasExisting: !!existingApplication,
      application: existingApplication,
      limits: {
        currentPending: applicationCount,
        maxPending: MAX_PENDING_APPLICATIONS,
        canApply: applicationCount < MAX_PENDING_APPLICATIONS && !existingApplication
      }
    })
  } catch (error) {
    console.error('[APPLICATION_CHECK]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}