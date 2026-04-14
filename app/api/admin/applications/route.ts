// app/api/admin/applications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ApplicationStatus, Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Verify admin role
    const admin = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true }
    })
    
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') as ApplicationStatus | 'all' | null
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    
    const where: Prisma.ApplicationWhereInput = {}
    
    if (status && status !== 'all') {
      where.status = status as ApplicationStatus
    }
    
    if (search) {
      where.OR = [
        { land: { title: { contains: search, mode: 'insensitive' } } },
        { farmer: { name: { contains: search, mode: 'insensitive' } } },
        // ✅ FIXED: Access user.name through landowner.user
        { land: { landowner: { user: { name: { contains: search, mode: 'insensitive' } } } } },
        { land: { village: { contains: search, mode: 'insensitive' } } },
        { land: { district: { contains: search, mode: 'insensitive' } } },
      ]
    }
    
    const orderBy: Prisma.ApplicationOrderByWithRelationInput = {}
    if (sortBy === 'proposedRent') {
      orderBy.proposedRent = sortOrder
    } else if (sortBy === 'duration') {
      orderBy.duration = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }
    
    const skip = (page - 1) * limit
    
    const [applications, total, stats] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          land: {
            include: {
              // ✅ FIXED: Include user through landowner
              landowner: {
                include: {
                  user: {
                    select: { id: true, name: true, email: true }
                  }
                }
              }
            }
          },
          farmer: {
            select: {
              id: true,
              name: true,
              email: true,
              farmerProfile: {
                select: {
                  primaryCrops: true,
                  farmingExperience: true,
                  isVerified: true
                }
              }
            }
          },
          listing: {
            select: { id: true, title: true }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.application.count({ where }),
      prisma.application.aggregate({
        where,
        _sum: { proposedRent: true }
      })
    ])
    
    // Transform applications to match AdminApplication interface
    const transformedApplications = applications.map(app => ({
      ...app,
      land: {
        ...app.land,
        landowner: {
          id: app.land.landowner.user.id,
          name: app.land.landowner.user.name,
          email: app.land.landowner.user.email
        }
      }
    }))
    
    // Get additional stats
    const [pendingReview, approvedToday, byStatus] = await Promise.all([
      prisma.application.count({
        where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } }
      }),
      prisma.application.count({
        where: {
          status: 'APPROVED',
          reviewedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      }),
      prisma.application.groupBy({
        by: ['status'],
        _count: { status: true }
      })
    ])
    
    const statusCounts: Record<string, number> = {}
    byStatus.forEach(s => { statusCounts[s.status] = s._count.status })
    
    return NextResponse.json({
      applications: transformedApplications,
      stats: {
        total,
        byStatus: statusCounts,
        totalValue: stats._sum.proposedRent || 0,
        pendingReview,
        approvedToday,
        avgResponseTime: 0
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('[ADMIN_APPLICATIONS_GET]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}