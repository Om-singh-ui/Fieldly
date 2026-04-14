// app/(protected)/applications/_components/applications-list.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { ApplicationStatus } from '@prisma/client'
import { ApplicationCard } from './application-card'
import { Loader2 } from 'lucide-react'

interface Application {
  id: string
  status: ApplicationStatus
  proposedRent: number | null
  duration: number
  cropPlan: string | null
  createdAt: Date
  land: {
    id: string
    title: string
    size: number
    landType: string
    village: string | null
    district: string | null
    state: string | null
    landowner: {
      id: string
      name: string
      imageUrl: string | null
    }
  }
  farmer: {
    id: string
    name: string
    imageUrl: string | null
    farmerProfile?: {
      primaryCrops: string[]
      farmingExperience: number
      isVerified: boolean
    } | null
  }
  listing?: {
    id: string
    title: string
  } | null
}

interface ApplicationsListProps {
  userId: string
  role: string | null
  status?: ApplicationStatus[]
}

export function ApplicationsList({ role, status }: ApplicationsListProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  
  const fetchApplications = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (status?.length) {
        status.forEach(s => params.append('status', s))
      }
      
      const res = await fetch(`/api/applications?${params.toString()}`)
      const data = await res.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }, [status])
  
  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
  
  if (applications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No applications found
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard 
          key={application.id} 
          application={application}
          viewMode={role === 'FARMER' ? 'farmer' : 'landowner'}
        />
      ))}
    </div>
  )
}