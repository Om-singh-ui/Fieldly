// app/(protected)/applications/[applicationId]/page.tsx
import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ApplicationService } from '@/lib/services/application.service'
import { ApplicationDetail } from '../_components/application-detail'
import { ApplicationDetailSkeleton } from '../_components/application-detail-skeleton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ApplicationPageProps {
  params: Promise<{
    applicationId: string
  }>
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  
  const { applicationId } = await params
  
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, role: true }
  })
  
  if (!user) {
    redirect('/onboarding')
  }
  
  const application = await ApplicationService.getApplicationById(
    applicationId,
    user.id,
    user.role ?? 'FARMER'
  )
  
  if (!application) {
    notFound()
  }
  
  const isFarmer = application.farmerId === user.id
  const isLandowner = application.land.landowner.id === user.id
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
  
  const permissions = {
    canEdit: isFarmer && application.status === 'PENDING',
    canWithdraw: isFarmer && ['PENDING', 'UNDER_REVIEW'].includes(application.status),
    canReview: isLandowner && ['PENDING', 'UNDER_REVIEW'].includes(application.status),
    canDelete: (isFarmer && application.status === 'PENDING') || isAdmin,
    isAdmin
  }

  return (
    <div className="container max-w-5xl py-8 mt-16">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={<ApplicationDetailSkeleton />}>
        <ApplicationDetail 
          application={application} 
          permissions={permissions}
          currentUserId={user.id}
        />
      </Suspense>
    </div>
  )
}