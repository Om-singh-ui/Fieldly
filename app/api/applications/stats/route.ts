// app/api/applications/stats/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface FarmerStats {
  total: number
  pending: number
  underReview: number
  approved: number
  rejected: number
  withdrawn: number
  successRate: string
  recentActivity: Array<{ status: string; createdAt: Date }>
}

interface LandownerStats {
  total: number
  pending: number
  underReview: number
  approved: number
  rejected: number
  pendingReviewCount: number
  approvalRate: string
}

export async function GET() {
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
    
    const isFarmer = user.role === 'FARMER'
    const isLandowner = user.role === 'LANDOWNER'
    
    let stats: FarmerStats | LandownerStats
    
    if (isFarmer) {
      const [
        total,
        pending,
        underReview,
        approved,
        rejected,
        withdrawn,
        recentActivity
      ] = await Promise.all([
        prisma.application.count({ where: { farmerId: user.id } }),
        prisma.application.count({ where: { farmerId: user.id, status: 'PENDING' } }),
        prisma.application.count({ where: { farmerId: user.id, status: 'UNDER_REVIEW' } }),
        prisma.application.count({ where: { farmerId: user.id, status: 'APPROVED' } }),
        prisma.application.count({ where: { farmerId: user.id, status: 'REJECTED' } }),
        prisma.application.count({ where: { farmerId: user.id, status: 'WITHDRAWN' } }),
        prisma.application.findMany({
          where: {
            farmerId: user.id,
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          },
          select: { status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        })
      ])
      
      stats = {
        total,
        pending,
        underReview,
        approved,
        rejected,
        withdrawn,
        successRate: total > 0 ? ((approved / total) * 100).toFixed(1) : '0',
        recentActivity
      }
    } else if (isLandowner) {
      const [
        total,
        pending,
        underReview,
        approved,
        rejected,
        pendingReviewCount
      ] = await Promise.all([
        prisma.application.count({
          where: { land: { landownerId: user.id } }
        }),
        prisma.application.count({
          where: { land: { landownerId: user.id }, status: 'PENDING' }
        }),
        prisma.application.count({
          where: { land: { landownerId: user.id }, status: 'UNDER_REVIEW' }
        }),
        prisma.application.count({
          where: { land: { landownerId: user.id }, status: 'APPROVED' }
        }),
        prisma.application.count({
          where: { land: { landownerId: user.id }, status: 'REJECTED' }
        }),
        prisma.application.count({
          where: {
            land: { landownerId: user.id },
            status: { in: ['PENDING', 'UNDER_REVIEW'] }
          }
        })
      ])
      
      stats = {
        total,
        pending,
        underReview,
        approved,
        rejected,
        pendingReviewCount,
        approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : '0'
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid user role' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({ stats })
  } catch (error) {
    console.error('[APPLICATION_STATS]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}