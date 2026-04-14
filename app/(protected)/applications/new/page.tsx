// app/(protected)/applications/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { 
  CreateApplicationInput, 
  createApplicationSchema 
} from '@/lib/validations/application.schema'
import { ContactProtectionBanner } from '../_components/contact-protection-banner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, IndianRupee, Calendar, FileText, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface Land {
  id: string
  title: string
  size: number
  landType: string
  village: string | null
  district: string | null
  state: string | null
  minLeaseDuration: number
  maxLeaseDuration: number
  expectedRentMin: number | null
  expectedRentMax: number | null
  allowedCropTypes: string[]
  isActive: boolean
  isArchived: boolean
}

const DURATION_OPTIONS = [3, 6, 12, 24, 36, 60]

export default function NewApplicationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedLand, setSelectedLand] = useState<Land | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingLand, setIsLoadingLand] = useState(false)
  
  const landId = searchParams.get('landId')
  const ownerId = searchParams.get('ownerId')
  
  const form = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      landId: landId || '',
      duration: 12,
      proposedRent: undefined,
      cropPlan: '',
      message: ''
    }
  })
  
  const watchDuration = form.watch('duration')
  const watchRent = form.watch('proposedRent')
  
  const calculateTotalValue = () => {
    if (!watchRent || !watchDuration) return null
    return watchRent * watchDuration
  }
  
  useEffect(() => {
    const fetchLandDetails = async (id: string) => {
      setIsLoadingLand(true)
      try {
        const res = await fetch(`/api/landowner/lands/${id}`)
        
        if (!res.ok) {
          const listRes = await fetch(`/api/landowner/lands?ownerId=${ownerId}&isActive=true`)
          const listData = await listRes.json()
          const land = listData.lands?.find((l: Land) => l.id === id)
          
          if (land) {
            setSelectedLand(land)
            form.setValue('landId', land.id)
          } else {
            toast.error('Land not found')
          }
        } else {
          const data = await res.json()
          setSelectedLand(data.land)
          form.setValue('landId', data.land.id)
        }
      } catch (error) {
        console.error('Failed to fetch land:', error)
        toast.error('Failed to load land details')
      } finally {
        setIsLoadingLand(false)
      }
    }

    if (landId) {
      fetchLandDetails(landId)
    }
  }, [landId, ownerId, form])
  
  const onSubmit = async (data: CreateApplicationInput) => {
    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }
      
      toast.success('Application submitted successfully!')
      router.push(`/applications/${result.application.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isLoadingLand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading land details...</p>
        </div>
      </div>
    )
  }
  
  if (!selectedLand) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl mx-auto">
          <Link 
            href="/marketplace"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle>Land Not Found</CardTitle>
              <CardDescription>
                The selected land could not be found. Please select a land from the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen py-8 mt-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={ownerId ? `/profile/${ownerId}` : "/marketplace"}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {ownerId ? 'Back to Profile' : 'Back to Marketplace'}
          </Link>
          
          <h1 className="text-3xl font-bold">New Application</h1>
          <p className="text-muted-foreground mt-2">
            Submit your application to lease land. All communication is platform-protected.
          </p>
        </div>
        
        <ContactProtectionBanner />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Applying for</CardTitle>
                <CardDescription>You are submitting an application for this land</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-xl">🌾</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{selectedLand.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {[selectedLand.village, selectedLand.district, selectedLand.state].filter(Boolean).join(', ')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Size</span>
                        <p className="text-sm font-medium">{selectedLand.size} acres</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Land Type</span>
                        <p className="text-sm font-medium">{selectedLand.landType}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Allowed Duration</span>
                        <p className="text-sm font-medium">
                          {selectedLand.minLeaseDuration}-{selectedLand.maxLeaseDuration} months
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>
                  Provide details about your lease proposal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Lease Duration
                      </FormLabel>
                      <Select 
                        onValueChange={(v) => field.onChange(parseInt(v))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DURATION_OPTIONS.map((months) => (
                            <SelectItem 
                              key={months} 
                              value={months.toString()}
                              disabled={months < selectedLand.minLeaseDuration || months > selectedLand.maxLeaseDuration}
                            >
                              {months} months {months === 12 ? '(1 year)' : months === 24 ? '(2 years)' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="proposedRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />
                        Proposed Monthly Rent (₹)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 15000" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormDescription>
                        {selectedLand.expectedRentMin && selectedLand.expectedRentMax ? (
                          <span>Expected range: ₹{selectedLand.expectedRentMin.toLocaleString('en-IN')} - ₹{selectedLand.expectedRentMax.toLocaleString('en-IN')}</span>
                        ) : selectedLand.expectedRentMin ? (
                          <span>Minimum expected: ₹{selectedLand.expectedRentMin.toLocaleString('en-IN')}</span>
                        ) : (
                          <span>Optional - Leave empty if flexible</span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {calculateTotalValue() && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Total Lease Value:</span>{' '}
                      <span className="font-semibold">
                        ₹{calculateTotalValue()?.toLocaleString('en-IN')}
                      </span>
                    </p>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="cropPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Crop Plan
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what crops you plan to grow..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Additional Message (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional information..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>⚠️ Important:</strong> Do not include phone numbers, email addresses, 
                or social media handles in your application.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}