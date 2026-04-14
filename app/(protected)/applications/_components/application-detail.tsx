// app/(protected)/applications/_components/application-detail.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { 
  MapPin, 
  Calendar, 
  IndianRupee, 
  User, 
  Phone, 
  Mail,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Flag,
  Loader2,
  Shield,
  Award
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { ApplicationStatus } from '@prisma/client'

// Make the interface more flexible to match the service return type
interface ApplicationDetailProps {
  application: {
    id: string
    status: ApplicationStatus
    proposedRent: number | null
    duration: number
    cropPlan: string | null
    message: string | null
    createdAt: Date
    reviewNotes: string | null
    reviewedAt: Date | null
    farmerId?: string  // Optional
    land: {
      id: string
      title: string
      size?: number  // Optional
      landType?: string  // Optional
      village?: string | null
      district?: string | null
      state?: string | null
      landowner: {
        id: string
        name: string
        email?: string
        phone?: string | null
        imageUrl: string | null
        landownerProfile?: {
          isVerified: boolean
          verificationLevel: number
        } | null
      }
      images?: Array<{
        id: string
        url: string
        isPrimary?: boolean
      }>
    }
    farmer: {
      id: string
      name: string
      email?: string
      phone?: string | null
      imageUrl: string | null
      state?: string | null
      district?: string | null
      farmerProfile?: {
        primaryCrops: string[]
        farmingExperience: number
        farmingType: string | null
        isVerified: boolean
      } | null
    }
    listing?: {
      id: string
      title: string
      basePrice: number
      status: string
      listingType: string
    } | null
  }
  permissions: {
    canEdit: boolean
    canWithdraw: boolean
    canReview: boolean
    canDelete: boolean
    isAdmin: boolean
  }
  currentUserId: string
}

const statusConfig: Record<ApplicationStatus, {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: React.ReactNode
}> = {
  PENDING: {
    label: 'Pending Review',
    variant: 'secondary',
    icon: <Clock className="h-4 w-4" />
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    variant: 'secondary',
    icon: <AlertCircle className="h-4 w-4" />
  },
  APPROVED: {
    label: 'Approved',
    variant: 'default',
    icon: <CheckCircle className="h-4 w-4" />
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'destructive',
    icon: <XCircle className="h-4 w-4" />
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    variant: 'outline',
    icon: <XCircle className="h-4 w-4" />
  },
  EXPIRED: {
    label: 'Expired',
    variant: 'outline',
    icon: <Clock className="h-4 w-4" />
  }
}

export function ApplicationDetail({ application, permissions, currentUserId }: ApplicationDetailProps) {
  const router = useRouter()
  const status = statusConfig[application.status]
  
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED')
  const [isLoading, setIsLoading] = useState(false)
  
  const isFarmer = application.farmer?.id === currentUserId || application.farmerId === currentUserId
  const isLandowner = application.land.landowner.id === currentUserId
  
  const handleWithdraw = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/applications/${application.id}/withdraw`, {
        method: 'POST'
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      
      toast.success('Application withdrawn successfully')
      router.refresh()
      setShowWithdrawDialog(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to withdraw')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      
      toast.success('Application deleted successfully')
      router.push('/applications')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleReview = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/applications/${application.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: reviewStatus, reviewNotes })
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      
      toast.success(`Application ${reviewStatus.toLowerCase()}`)
      router.refresh()
      setShowReviewDialog(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to review')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Safely access nested properties
  const landSize = application.land.size ?? 'N/A'
  const landType = application.land.landType ?? 'N/A'
  const location = [
    application.land.village, 
    application.land.district, 
    application.land.state
  ].filter(Boolean).join(', ')
  
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{application.land.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={status.variant} className="gap-1">
                {status.icon}
                {status.label}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Applied {format(new Date(application.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {permissions.canEdit && (
              <Button variant="outline" asChild>
                <Link href={`/applications/${application.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
            )}
            
            {permissions.canWithdraw && (
              <Button variant="outline" onClick={() => setShowWithdrawDialog(true)}>
                <Flag className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            )}
            
            {permissions.canReview && (
              <Button onClick={() => setShowReviewDialog(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Review
              </Button>
            )}
            
            {permissions.canDelete && (
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Land Details</CardTitle>
                <CardDescription>Information about the land being leased</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {location || 'Location not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Land Size</Label>
                    <p className="font-medium">
                      {typeof landSize === 'number' ? `${landSize} acres` : landSize}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Land Type</Label>
                    <p className="font-medium">{landType}</p>
                  </div>
                  {application.listing && (
                    <div>
                      <Label className="text-muted-foreground">Listing</Label>
                      <p className="font-medium">{application.listing.title}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>Lease proposal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Lease Duration</Label>
                    <p className="font-medium">{application.duration} months</p>
                  </div>
                  {application.proposedRent && (
                    <div>
                      <Label className="text-muted-foreground">Proposed Monthly Rent</Label>
                      <p className="font-medium flex items-center">
                        <IndianRupee className="h-4 w-4" />
                        {application.proposedRent.toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>
                
                {application.cropPlan && (
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Crop Plan
                    </Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{application.cropPlan}</p>
                    </div>
                  </div>
                )}
                
                {application.message && (
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Additional Message
                    </Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{application.message}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {application.reviewNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Notes</CardTitle>
                  <CardDescription>
                    Reviewed on {application.reviewedAt && format(new Date(application.reviewedAt), 'MMMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{application.reviewNotes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Landowner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={application.land.landowner.imageUrl || undefined} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{application.land.landowner.name}</p>
                    {application.land.landowner.landownerProfile?.isVerified && (
                      <Badge variant="secondary" className="gap-1 mt-1">
                        <Award className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                {(isFarmer || permissions.isAdmin) && (
                  <div className="space-y-2 pt-3 border-t">
                    {application.land.landowner.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{application.land.landowner.email}</span>
                      </div>
                    )}
                    {application.land.landowner.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{application.land.landowner.phone}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {!isFarmer && !permissions.isAdmin && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Contact info available after approval
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Farmer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={application.farmer.imageUrl || undefined} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{application.farmer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {[application.farmer.state, application.farmer.district].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
                
                {application.farmer.farmerProfile && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-medium">{application.farmer.farmerProfile.farmingExperience} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Farming Type</span>
                      <span className="font-medium">{application.farmer.farmerProfile.farmingType}</span>
                    </div>
                    {application.farmer.farmerProfile.primaryCrops.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Primary Crops</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {application.farmer.farmerProfile.primaryCrops.map((crop) => (
                            <Badge key={crop} variant="outline" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {(isLandowner || permissions.isAdmin) && (
                  <div className="space-y-2 pt-3 border-t">
                    {application.farmer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{application.farmer.email}</span>
                      </div>
                    )}
                    {application.farmer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{application.farmer.phone}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {!isLandowner && !permissions.isAdmin && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Contact info available after approval
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Dialogs remain the same */}
      <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleWithdraw} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Withdraw'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Approve or reject this lease application
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-4">
              <Button
                variant={reviewStatus === 'APPROVED' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setReviewStatus('APPROVED')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant={reviewStatus === 'REJECTED' ? 'destructive' : 'outline'}
                className="flex-1"
                onClick={() => setReviewStatus('REJECTED')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
            
            <div>
              <Label htmlFor="reviewNotes">
                {reviewStatus === 'APPROVED' ? 'Notes (Optional)' : 'Reason for Rejection'}
              </Label>
              <Textarea
                id="reviewNotes"
                placeholder={reviewStatus === 'APPROVED' 
                  ? 'Add any notes for the farmer...' 
                  : 'Please provide a reason for rejection...'}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleReview} 
              disabled={isLoading || (reviewStatus === 'REJECTED' && !reviewNotes)}
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Confirm {reviewStatus === 'APPROVED' ? 'Approval' : 'Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}