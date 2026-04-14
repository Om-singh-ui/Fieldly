// app/api/admin/applications/bulk-review/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/actions/notifications/createNotification'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const admin = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true, id: true, name: true }
    })
    
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const body = await req.json()
    const { applicationIds, action, notes } = body
    
    if (!applicationIds?.length || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const results = await prisma.$transaction(async (tx) => {
      const applications = await tx.application.findMany({
        where: {
          id: { in: applicationIds },
          status: { in: ['PENDING', 'UNDER_REVIEW'] }
        },
        include: {
          land: { include: { landowner: true } },
          farmer: true
        }
      })
      
      const updated = []
      
      for (const app of applications) {
        const updatedApp = await tx.application.update({
          where: { id: app.id },
          data: {
            status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
            reviewNotes: notes,
            reviewedAt: new Date()
          }
        })
        
        if (action === 'APPROVE') {
          const rent = app.proposedRent || app.land.expectedRentMin || 0
          
          await tx.lease.create({
            data: {
              landId: app.landId,
              farmerId: app.farmerId,
              ownerId: app.land.landownerId,
              listingId: app.listingId,
              rent,
              startDate: new Date(),
              endDate: new Date(Date.now() + app.duration * 30 * 24 * 60 * 60 * 1000),
              status: 'PENDING_SIGNATURE',
              leaseSource: app.listingId ? 'AUCTION' : 'DIRECT',
              securityDeposit: rent * 2,
              grossContractValue: rent * app.duration,
              platformFee: rent * app.duration * 0.05,
              netOwnerReceivable: rent * app.duration * 0.95
            }
          })
        }
        
        await tx.auditLog.create({
          data: {
            userId: admin.id,
            action: `APPLICATION_${action === 'APPROVE' ? 'APPROVED' : 'REJECTED'}`,
            entity: 'Application',
            entityId: app.id,
            metadata: { reviewNotes: notes, bulkAction: true }
          }
        })
        
        await createNotification({
          userId: app.farmerId,
          type: 'APPLICATION',
          title: `Application ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`,
          message: action === 'APPROVE'
            ? `Your application for "${app.land.title}" has been approved.`
            : `Your application for "${app.land.title}" was not accepted.`,
          entityType: 'Application',
          entityId: app.id,
          actionUrl: `/applications/${app.id}`,
          priority: 'MEDIUM'
        })
        
        updated.push(updatedApp)
      }
      
      return updated
    })
    
    return NextResponse.json({
      success: true,
      count: results.length
    })
  } catch (error) {
    console.error('[ADMIN_BULK_REVIEW]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}