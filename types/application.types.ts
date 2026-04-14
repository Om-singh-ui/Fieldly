// types/application.types.ts
import { ApplicationStatus, Land, LandListing } from '@prisma/client'

export interface ApplicationWithRelations {
  id: string
  landId: string
  farmerId: string
  listingId: string | null
  proposedRent: number | null
  duration: number
  cropPlan: string | null
  message: string | null
  status: ApplicationStatus
  createdAt: Date
  updatedAt: Date
  reviewNotes: string | null
  reviewedAt: Date | null
  
  // Relations
  land: Land & {
    landowner: {
      id: string
      name: string
      email: string
      imageUrl: string | null
      state: string | null
      district: string | null
    }
  }
  farmer: {
    id: string
    name: string
    email: string
    imageUrl: string | null
    phone: string | null
    farmerProfile: {
      primaryCrops: string[]
      farmingExperience: number
      isVerified: boolean
    } | null
  }
  listing: LandListing | null
}

export interface CreateApplicationInput {
  landId: string
  listingId?: string
  proposedRent?: number
  duration: number
  cropPlan?: string
  message?: string
}

export interface ApplicationFilters {
  status?: ApplicationStatus[]
  landType?: string[]
  dateRange?: {
    from: Date
    to: Date
  }
}

export type ApplicationAction = 
  | 'APPROVE'
  | 'REJECT'
  | 'WITHDRAW'
  | 'REVIEW'