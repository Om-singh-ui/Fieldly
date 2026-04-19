// app/(protected)/applications/page.tsx
import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ApplicationsList } from './_components/applications-list'
import { ApplicationFilters } from './_components/application-filters'

export const dynamic = 'force-dynamic'

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tab?: string }>
}) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  
  const params = await searchParams
  
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, role: true }
  })
  
  if (!user) {
    redirect('/onboarding')
  }
  
  const isFarmer = user.role === 'FARMER'
  
  return (
    <div className="flex justify-center w-full mt-16">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground mt-2">
              {isFarmer 
                ? 'Track and manage your land lease applications'
                : 'Review and respond to applications for your lands'
              }
            </p>
          </div>
          
          {isFarmer && (
            <Button asChild className="shrink-0">
              <Link href="/applications/new">
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Link>
            </Button>
          )}
        </div>
        
        <Tabs defaultValue={params.tab || 'all'} className="space-y-6">
          <TabsList className="inline-flex w-auto overflow-x-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-64 shrink-0">
              <ApplicationFilters />
            </aside>
            
            <main className="flex-1 min-w-0">
              <Suspense fallback={<ApplicationsSkeleton />}>
                <TabsContent value="all" className="mt-0">
                  <ApplicationsList userId={user.id} role={user.role} />
                </TabsContent>
                <TabsContent value="pending" className="mt-0">
                  <ApplicationsList userId={user.id} role={user.role} status={['PENDING']} />
                </TabsContent>
                <TabsContent value="under_review" className="mt-0">
                  <ApplicationsList userId={user.id} role={user.role} status={['UNDER_REVIEW']} />
                </TabsContent>
                <TabsContent value="approved" className="mt-0">
                  <ApplicationsList userId={user.id} role={user.role} status={['APPROVED']} />
                </TabsContent>
                <TabsContent value="rejected" className="mt-0">
                  <ApplicationsList userId={user.id} role={user.role} status={['REJECTED']} />
                </TabsContent>
              </Suspense>
            </main>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

function ApplicationsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  )
}