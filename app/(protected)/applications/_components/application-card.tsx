// app/(protected)/applications/_components/application-card.tsx
'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { 
  Clock, 
  MapPin,  
  Calendar,
  IndianRupee,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock3,
  User
} from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { ApplicationStatus } from '@prisma/client'

interface ApplicationCardProps {
  application: {
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
  viewMode?: 'farmer' | 'landowner'
}

const statusConfig: Record<ApplicationStatus, {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: React.ReactNode
}> = {
  PENDING: {
    label: 'Pending Review',
    variant: 'secondary',
    icon: <Clock3 className="h-3 w-3" />
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    variant: 'secondary',
    icon: <AlertCircle className="h-3 w-3" />
  },
  APPROVED: {
    label: 'Approved',
    variant: 'default',
    icon: <CheckCircle className="h-3 w-3" />
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'destructive',
    icon: <XCircle className="h-3 w-3" />
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    variant: 'outline',
    icon: <XCircle className="h-3 w-3" />
  },
  EXPIRED: {
    label: 'Expired',
    variant: 'outline',
    icon: <Clock className="h-3 w-3" />
  }
}

export function ApplicationCard({ application, viewMode = 'farmer' }: ApplicationCardProps) {
  const status = statusConfig[application.status]
  const isFarmer = viewMode === 'farmer'
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                {application.land.title}
              </h3>
              <Badge variant={status.variant} className="gap-1">
                {status.icon}
                {status.label}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>
                  {application.land.village}, {application.land.district}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Applied {format(new Date(application.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Land Details</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{application.land.size} acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{application.land.landType}</span>
              </div>
              {application.proposedRent && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proposed Rent:</span>
                  <span className="font-medium flex items-center">
                    <IndianRupee className="h-3 w-3 mr-0.5" />
                    {application.proposedRent.toLocaleString('en-IN')}/month
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Application Details</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{application.duration} months</span>
              </div>
              {application.farmer.farmerProfile?.primaryCrops && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crops:</span>
                  <span className="font-medium truncate max-w-[150px]">
                    {application.farmer.farmerProfile.primaryCrops.slice(0, 3).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {application.cropPlan && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground line-clamp-2">
              <span className="font-medium">Crop Plan:</span> {application.cropPlan}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={isFarmer ? application.land.landowner.imageUrl || undefined : application.farmer.imageUrl || undefined} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {isFarmer ? application.land.landowner.name : application.farmer.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {isFarmer ? 'Landowner' : 'Farmer'}
              {!isFarmer && application.farmer.farmerProfile?.isVerified && (
                <span className="ml-1 text-green-600">✓ Verified</span>
              )}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/applications/${application.id}`}>
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}