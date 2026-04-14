// app/api/applications/[applicationId]/withdraw/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/actions/notifications/createNotification'

// ✅ MUST use named export, NOT default export
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { applicationId } = await params
    
    // Get the current user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true, name: true, role: true }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Find the application with related data
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        land: {
          include: {
            landowner: {
              include: {
                user: {
                  select: { 
                    id: true, 
                    name: true,
                    email: true 
                  }
                }
              }
            }
          }
        },
        farmer: {
          select: { 
            id: true, 
            name: true,
            email: true 
          }
        },
        listing: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }
    
    // Check if user is authorized to withdraw
    const isFarmer = application.farmerId === user.id
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
    
    if (!isFarmer && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only withdraw your own applications' },
        { status: 403 }
      )
    }
    
    // Check if application can be withdrawn
    const withdrawableStatuses = ['PENDING', 'UNDER_REVIEW']
    if (!withdrawableStatuses.includes(application.status)) {
      return NextResponse.json(
        { 
          error: `Cannot withdraw application with status: ${application.status}. Only pending or under review applications can be withdrawn.` 
        },
        { status: 400 }
      )
    }
    
    // Perform withdrawal in transaction
    const updatedApplication = await prisma.$transaction(async (tx) => {
      // Update application status
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: 'WITHDRAWN',
          updatedAt: new Date()
        }
      })
      
      // If application was linked to a listing, decrement application count
      if (application.listingId) {
        await tx.landListing.update({
          where: { id: application.listingId },
          data: {
            applicationCount: {
              decrement: 1
            }
          }
        })
      }
      
      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'APPLICATION_WITHDRAWN',
          entity: 'Application',
          entityId: applicationId,
          metadata: {
            landId: application.landId,
            listingId: application.listingId,
            previousStatus: application.status,
            withdrawnBy: user.id,
            withdrawnByRole: isAdmin ? 'ADMIN' : 'FARMER'
          }
        }
      })
      
      return updated
    })
    
    // Send notification to landowner
    await createNotification({
      userId: application.land.landowner.user.id,
      type: 'APPLICATION',
      title: 'Application Withdrawn',
      message: `${application.farmer.name} has withdrawn their application for "${application.land.title}".`,
      entityType: 'Application',
      entityId: applicationId,
      actionUrl: `/landowner/applications`,
      priority: 'MEDIUM'
    })
    
    // Send confirmation to farmer (if admin withdrew it)
    if (isAdmin && !isFarmer) {
      await createNotification({
        userId: application.farmerId,
        type: 'APPLICATION',
        title: 'Application Withdrawn by Admin',
        message: `Your application for "${application.land.title}" has been withdrawn by an administrator.`,
        entityType: 'Application',
        entityId: applicationId,
        actionUrl: `/applications`,
        priority: 'MEDIUM'
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Application withdrawn successfully',
      application: {
        id: updatedApplication.id,
        status: updatedApplication.status,
        landTitle: application.land.title,
        withdrawnAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('[APPLICATION_WITHDRAW]', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}