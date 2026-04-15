// app/(protected)/applications/_components/application-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { 
  CreateApplicationInput, 
  createApplicationSchema 
} from '@/lib/validations/application.schema'
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
import { Loader2, IndianRupee, Calendar, FileText, MessageSquare } from 'lucide-react'
import type { Land } from '@/types/land.types'

interface ApplicationFormProps {
  land: Land
  onSuccess?: (applicationId: string) => void
  onCancel?: () => void
  prefilledData?: Partial<CreateApplicationInput>
}

const DURATION_OPTIONS = [
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 12, label: '1 year' },
  { value: 24, label: '2 years' },
  { value: 36, label: '3 years' },
  { value: 60, label: '5 years' },
]

export function ApplicationForm({ land, onSuccess, onCancel, prefilledData }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      landId: land.id,
      duration: prefilledData?.duration || 12,
      proposedRent: prefilledData?.proposedRent || undefined,
      cropPlan: prefilledData?.cropPlan || '',
      message: prefilledData?.message || '',
    }
  })
  
  const watchDuration = form.watch('duration')
  const watchRent = form.watch('proposedRent')
  
  const calculateTotalValue = () => {
    if (!watchRent || !watchDuration) return null
    return watchRent * watchDuration
  }
  
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
      onSuccess?.(result.application.id)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Land Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Applying for</CardTitle>
            <CardDescription>You are submitting an application for this land</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xl">🌾</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{land.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {land.village}, {land.district}, {land.state}
                </p>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Size</span>
                    <p className="text-sm font-medium">{land.size} acres</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Land Type</span>
                    <p className="text-sm font-medium">{land.landType}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Allowed Duration</span>
                    <p className="text-sm font-medium">
                      {land.minLeaseDuration}-{land.maxLeaseDuration} months
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Form Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>
              Provide details about your lease proposal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Duration */}
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
                      {DURATION_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value.toString()}
                          disabled={option.value < land.minLeaseDuration || option.value > land.maxLeaseDuration}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {watchDuration < land.minLeaseDuration && (
                      <span className="text-red-500">
                        Minimum duration is {land.minLeaseDuration} months
                      </span>
                    )}
                    {watchDuration > land.maxLeaseDuration && (
                      <span className="text-red-500">
                        Maximum duration is {land.maxLeaseDuration} months
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Proposed Rent */}
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
                    {land.expectedRentMin && land.expectedRentMax ? (
                      <span>Expected range: ₹{land.expectedRentMin.toLocaleString('en-IN')} - ₹{land.expectedRentMax.toLocaleString('en-IN')} per month</span>
                    ) : land.expectedRentMin ? (
                      <span>Minimum expected: ₹{land.expectedRentMin.toLocaleString('en-IN')} per month</span>
                    ) : (
                      <span>Optional - Leave empty if flexible</span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Total Value Preview */}
            {calculateTotalValue() && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="text-muted-foreground">Total Lease Value:</span>{' '}
                  <span className="font-semibold">
                    ₹{calculateTotalValue()?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (₹{watchRent?.toLocaleString('en-IN')} × {watchDuration} months)
                  </span>
                </p>
              </div>
            )}
            
            {/* Crop Plan */}
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
                      placeholder="Describe what crops you plan to grow, farming methods, and expected yield..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {land.allowedCropTypes?.length > 0 && (
                      <span>
                        <strong>Allowed crops:</strong> {land.allowedCropTypes.join(', ')}
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Additional Message */}
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
                      placeholder="Any additional information you'd like to share with the landowner..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share your experience, references, or specific requirements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        {/* Contact Protection Reminder */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>⚠️ Important:</strong> Do not include phone numbers, email addresses, 
            or social media handles in your application. Our platform protects your privacy.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex-1 bg-black text-white hover:bg-gray-800"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}