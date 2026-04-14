// app/(protected)/applications/layout.tsx
import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'  
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Applications | Fieldly',
  description: 'Manage your land lease applications'
}

export default async function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()  
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return (
    <div className="w-full flex justify-center">
      {children}
    </div>
  )
}