// hooks/use-applications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApplicationStatus } from '@prisma/client'

interface ApplicationFilters {
  status?: ApplicationStatus[]
  search?: string
  limit?: number
  offset?: number
}

interface ReviewApplicationData {
  status: 'APPROVED' | 'REJECTED'
  reviewNotes?: string
}

export function useApplications(filters?: ApplicationFilters) {
  const queryString = new URLSearchParams()
  if (filters?.status) {
    filters.status.forEach(s => queryString.append('status', s))
  }
  if (filters?.search) queryString.set('search', filters.search)
  if (filters?.limit) queryString.set('limit', filters.limit.toString())
  if (filters?.offset) queryString.set('offset', filters.offset.toString())
  
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const res = await fetch(`/api/applications?${queryString.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch applications')
      return res.json()
    }
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application submitted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export function useReviewApplication() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ReviewApplicationData }) => {
      const res = await fetch(`/api/applications/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      return res.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] })
      toast.success('Application reviewed successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}