// app/api/admin/applications/bulk-delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const admin = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true, id: true }
    })
    
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const body = await req.json()
    const { applicationIds } = body
    
    if (!applicationIds?.length) {
      return NextResponse.json({ error: 'Missing applicationIds' }, { status: 400 })
    }
    
    await prisma.$transaction(async (tx) => {
      // Decrement application counts for listings
      const applications = await tx.application.findMany({
        where: { id: { in: applicationIds } },
        select: { listingId: true }
      })
      
      const listingIds = applications.filter(a => a.listingId).map(a => a.listingId!)
      
      if (listingIds.length) {
        await tx.landListing.updateMany({
          where: { id: { in: listingIds } },
          data: { applicationCount: { decrement: 1 } }
        })
      }
      
      await tx.application.deleteMany({
        where: { id: { in: applicationIds } }
      })
      
      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: 'APPLICATIONS_BULK_DELETED',
          entity: 'Application',
          metadata: { applicationIds, count: applicationIds.length }
        }
      })
    })
    
    return NextResponse.json({
      success: true,
      count: applicationIds.length
    })
  } catch (error) {
    console.error('[ADMIN_BULK_DELETE]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}