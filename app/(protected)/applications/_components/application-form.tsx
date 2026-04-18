// app/(protected)/applications/_components/application-form.tsx
'use client'

import { useState, useEffect } from 'react'
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
import { 
  Loader2, 
  IndianRupee, 
  Calendar, 
  FileText, 
  MessageSquare,
  AlertTriangle,
  Shield,
  XCircle,
  CheckCircle2,
  Ban
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

// AGGRESSIVE BLOCKLIST - Blocks ANY contact attempt
const BLOCKED_PATTERNS = [
  // Email symbols and domains
  '@', 'gmail', 'yahoo', 'outlook', 'hotmail', 'icloud', 'proton', 'email',
  '.com', '.in', '.org', '.net', '.co', '.io', '.uk', '.us',
  
  // Contact keywords
  'contact', 'call', 'text', 'reach', 'ping', 'dm', 'message me',
  'whatsapp', 'telegram', 'signal', 'instagram', 'facebook', 'twitter', 'linkedin',
  
  // Phone indicators
  'phone', 'mobile', 'number', 'cell', '+91', '+1', '+44',
  
  // Obfuscation attempts
  '[at]', '[dot]', '(at)', '(dot)', ' at ', ' dot ',
]

// Phone number regex - catches any 10+ digit sequence
const PHONE_REGEX = /\d{10,}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|[6-9]\d{2}[-.\s]?\d{3}[-.\s]?\d{4}/g

function validateNoContactInfo(text: string): { valid: boolean; violations: string[] } {
  if (!text) return { valid: true, violations: [] }
  
  const lowerText = text.toLowerCase()
  const violations: string[] = []
  
  // Check blocked keywords
  BLOCKED_PATTERNS.forEach(pattern => {
    if (lowerText.includes(pattern.toLowerCase())) {
      violations.push(`"${pattern}"`)
    }
  })
  
  // Check phone numbers
  const phoneMatches = text.match(PHONE_REGEX)
  if (phoneMatches) {
    phoneMatches.forEach(match => {
      const digits = match.replace(/\D/g, '')
      if (digits.length >= 10) {
        violations.push(`Phone: ${match.trim().substring(0, 15)}`)
      }
    })
  }
  
  // Check for spaced-out email patterns
  const spaceless = lowerText.replace(/\s+/g, '')
  if (spaceless.includes('@') && (spaceless.includes('.com') || spaceless.includes('gmail'))) {
    violations.push('Email pattern')
  }
  
  // Check for number sequences in words
  const words = text.split(/\s+/)
  words.forEach(word => {
    const digits = word.replace(/\D/g, '')
    if (digits.length >= 10) {
      violations.push(`Phone: ${word.substring(0, 15)}`)
    }
  })
  
  return {
    valid: violations.length === 0,
    violations: [...new Set(violations)].slice(0, 10)
  }
}

export function ApplicationForm({ land, onSuccess, onCancel, prefilledData }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cropPlanError, setCropPlanError] = useState<string | null>(null)
  const [messageError, setMessageError] = useState<string | null>(null)
  const [cropPlanViolations, setCropPlanViolations] = useState<string[]>([])
  const [messageViolations, setMessageViolations] = useState<string[]>([])
  
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
  const watchCropPlan = form.watch('cropPlan')
  const watchMessage = form.watch('message')
  
  // Validate on every keystroke
  useEffect(() => {
    if (watchCropPlan) {
      const result = validateNoContactInfo(watchCropPlan)
      setCropPlanError(result.valid ? null : 'Contact information not allowed')
      setCropPlanViolations(result.violations)
    } else {
      setCropPlanError(null)
      setCropPlanViolations([])
    }
  }, [watchCropPlan])
  
  useEffect(() => {
    if (watchMessage) {
      const result = validateNoContactInfo(watchMessage)
      setMessageError(result.valid ? null : 'Contact information not allowed')
      setMessageViolations(result.violations)
    } else {
      setMessageError(null)
      setMessageViolations([])
    }
  }, [watchMessage])
  
  const calculateTotalValue = () => {
    if (!watchRent || !watchDuration) return null
    return watchRent * watchDuration
  }
  
  const isDurationValid = watchDuration >= land.minLeaseDuration && watchDuration <= land.maxLeaseDuration
  const isRentValid = !watchRent || 
    ((!land.expectedRentMin || watchRent >= land.expectedRentMin) && 
     (!land.expectedRentMax || watchRent <= land.expectedRentMax))
  
  const hasContactViolations = cropPlanError !== null || messageError !== null
  const isFormValid = isDurationValid && isRentValid && !hasContactViolations
  
  const onSubmit = async (data: CreateApplicationInput) => {
    // Final validation
    const cropCheck = validateNoContactInfo(data.cropPlan || '')
    const messageCheck = validateNoContactInfo(data.message || '')
    
    if (!cropCheck.valid || !messageCheck.valid) {
      toast.error('🚫 Contact Information Blocked', {
        description: 'Please remove all contact details before submitting.',
        duration: 5000,
      })
      return
    }
    
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
  
  const allViolations = [...cropPlanViolations, ...messageViolations]
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* VIOLATION ALERT - Most Important */}
        {hasContactViolations && (
          <Alert variant="destructive" className="border-2 border-red-500 bg-red-50">
            <Ban className="h-5 w-5" />
            <AlertTitle className="font-bold text-red-800 text-lg">
              🚫 CONTACT INFORMATION BLOCKED
            </AlertTitle>
            <AlertDescription>
              <div className="space-y-2 mt-2">
                <p className="font-medium text-red-700">
                  Remove the following restricted content:
                </p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-white rounded border border-red-200">
                  {allViolations.map((v, i) => (
                    <Badge key={i} variant="destructive" className="text-sm py-1">
                      <XCircle className="h-3 w-3 mr-1" />
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Land Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              Applying for
              <Badge variant="secondary">
                <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                Available
              </Badge>
            </CardTitle>
            <CardDescription>You are submitting an application for this land</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌾</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{land.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {[land.village, land.district, land.state].filter(Boolean).join(', ')}
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
                    <span className="text-xs text-muted-foreground">Duration</span>
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
            <CardDescription>Provide details about your lease proposal</CardDescription>
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
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className={!isDurationValid ? 'border-red-300' : ''}>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DURATION_OPTIONS.map((option) => {
                        const isValid = option.value >= land.minLeaseDuration && option.value <= land.maxLeaseDuration
                        return (
                          <SelectItem 
                            key={option.value} 
                            value={option.value.toString()}
                            disabled={!isValid}
                          >
                            {option.label}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
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
                      placeholder="e.g., 25000"
                      min={0}
                      className={!isRentValid ? 'border-red-300' : ''}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : undefined
                        field.onChange(value)
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Expected: ₹{land.expectedRentMin?.toLocaleString('en-IN') || '25,000'} - ₹{land.expectedRentMax?.toLocaleString('en-IN') || '3,50,000'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Total Value */}
            {calculateTotalValue() && isRentValid && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm">
                  <span className="text-muted-foreground">Total:</span>{' '}
                  <span className="font-semibold text-emerald-700">
                    ₹{calculateTotalValue()?.toLocaleString('en-IN')}
                  </span>
                </p>
              </div>
            )}
            
            {/* Crop Plan - WITH BLOCKING */}
            <FormField
              control={form.control}
              name="cropPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Crop Plan
                    {cropPlanError && (
                      <Badge variant="destructive">
                        <Ban className="h-3 w-3 mr-1" />
                        Blocked
                      </Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your farming plan (NO contact info allowed)..."
                      className={`min-h-[120px] ${cropPlanError ? 'border-2 border-red-500 bg-red-50/30' : ''}`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className={cropPlanError ? 'text-red-600 font-medium' : 'text-amber-600'}>
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    {cropPlanError || 'NO: @, gmail, .com, phone numbers, contact info'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Message - WITH BLOCKING */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Additional Message (Optional)
                    {messageError && (
                      <Badge variant="destructive">
                        <Ban className="h-3 w-3 mr-1" />
                        Blocked
                      </Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information (NO contact info allowed)..."
                      className={`min-h-[100px] ${messageError ? 'border-2 border-red-500 bg-red-50/30' : ''}`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className={messageError ? 'text-red-600 font-medium' : 'text-amber-600'}>
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    {messageError || 'NO: @, gmail, .com, phone numbers, contact info'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        {/* Protection Notice */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-700 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">🚫 Platform Protection Active</p>
              <p className="text-sm text-amber-800">
                Contact information is STRICTLY BLOCKED. Any application containing emails, 
                phone numbers, or social media will be rejected.
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting || !isFormValid} 
            className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
            ) : hasContactViolations ? (
              <><Ban className="h-4 w-4 mr-2" />Remove Contact Information</>
            ) : !isDurationValid ? (
              'Invalid Duration'
            ) : !isRentValid ? (
              'Invalid Rent Amount'
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}