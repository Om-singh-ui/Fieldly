// app/api/applications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ApplicationService } from '@/lib/services/application.service'
import { createApplicationSchema } from '@/lib/validations/application.schema'
import { ApplicationStatus } from '@prisma/client'

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
    const status = searchParams.getAll('status') as ApplicationStatus[]
    const search = searchParams.get('search') || undefined
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    
    const result = await ApplicationService.getApplications(
      user.id,
      user.role as 'FARMER' | 'LANDOWNER',
      { status, search, limit, offset, sortBy, sortOrder }
    )
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('[APPLICATIONS_GET]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { 
        id: true, 
        role: true, 
        isOnboarded: true,
        farmerProfile: true
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    if (user.role !== 'FARMER') {
      return NextResponse.json(
        { error: 'Only farmers can create applications' },
        { status: 403 }
      )
    }
    
    if (!user.isOnboarded) {
      return NextResponse.json(
        { error: 'Please complete onboarding before applying' },
        { status: 400 }
      )
    }
    
    if (!user.farmerProfile) {
      return NextResponse.json(
        { error: 'Please complete your farmer profile first' },
        { status: 400 }
      )
    }
    
    const pendingCount = await prisma.application.count({
      where: {
        farmerId: user.id,
        status: { in: ['PENDING', 'UNDER_REVIEW'] },
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    })
    
    if (pendingCount >= 10) {
      return NextResponse.json(
        { error: 'You have reached the maximum limit of pending applications (10)' },
        { status: 400 }
      )
    }
    
    const body = await req.json()
    
    const validated = createApplicationSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.issues },
        { status: 400 }
      )
    }
    
    const application = await ApplicationService.createApplication(
      user.id,
      validated.data
    )
    
    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error('[APPLICATIONS_POST]', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('not found') ? 404 : 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}