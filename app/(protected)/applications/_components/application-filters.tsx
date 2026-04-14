// app/(protected)/applications/_components/application-filters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { Filter, X, MapPin, IndianRupee, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const LAND_TYPES = [
  { value: 'AGRICULTURAL', label: 'Agricultural' },
  { value: 'FALLOW', label: 'Fallow' },
  { value: 'ORCHARD', label: 'Orchard' },
  { value: 'PASTURE', label: 'Pasture' },
  { value: 'VINEYARD', label: 'Vineyard' },
  { value: 'GREENHOUSE', label: 'Greenhouse' },
]

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', icon: Clock },
  { value: 'UNDER_REVIEW', label: 'Under Review', icon: AlertCircle },
  { value: 'APPROVED', label: 'Approved', icon: CheckCircle },
  { value: 'REJECTED', label: 'Rejected', icon: X },
  { value: 'WITHDRAWN', label: 'Withdrawn', icon: X },
]

export function ApplicationFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const status = searchParams.getAll('status')
  const landType = searchParams.getAll('landType')
  const location = searchParams.get('location') || ''
  const rentMin = parseInt(searchParams.get('rentMin') || '0')
  const rentMax = parseInt(searchParams.get('rentMax') || '100000')
  
  const activeFiltersCount = useMemo(() => {
    return (
      status.length +
      landType.length +
      (location ? 1 : 0) +
      (rentMin > 0 ? 1 : 0) +
      (rentMax < 100000 ? 1 : 0)
    )
  }, [status, landType, location, rentMin, rentMax])
  
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    
    status.forEach(s => params.append('status', s))
    landType.forEach(t => params.append('landType', t))
    
    if (location) params.set('location', location)
    if (rentMin > 0) params.set('rentMin', rentMin.toString())
    if (rentMax < 100000) params.set('rentMax', rentMax.toString())
    
    router.push(`/applications?${params.toString()}`)
  }, [status, landType, location, rentMin, rentMax, router])
  
  const clearFilters = useCallback(() => {
    router.push('/applications')
  }, [router])
  
  const updateStatus = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentStatus = params.getAll('status')
    
    if (currentStatus.includes(value)) {
      params.delete('status')
      currentStatus.filter(s => s !== value).forEach(s => params.append('status', s))
    } else {
      params.append('status', value)
    }
    
    router.push(`/applications?${params.toString()}`)
  }
  
  const updateLandType = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentTypes = params.getAll('landType')
    
    if (currentTypes.includes(value)) {
      params.delete('landType')
      currentTypes.filter(t => t !== value).forEach(t => params.append('landType', t))
    } else {
      params.append('landType', value)
    }
    
    router.push(`/applications?${params.toString()}`)
  }
  
  const updateLocation = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('location', value)
    } else {
      params.delete('location')
    }
    router.push(`/applications?${params.toString()}`)
  }
  
  const updateRentRange = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min > 0) {
      params.set('rentMin', min.toString())
    } else {
      params.delete('rentMin')
    }
    if (max < 100000) {
      params.set('rentMax', max.toString())
    } else {
      params.delete('rentMax')
    }
    router.push(`/applications?${params.toString()}`)
  }
  
  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Accordion type="multiple" defaultValue={['status', 'location']}>
          {/* Status Filter */}
          <AccordionItem value="status">
            <AccordionTrigger>Application Status</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={status.includes(option.value)}
                        onChange={() => updateStatus(option.value)}
                        className="rounded border-gray-300"
                      />
                      <Icon className="h-3 w-3" />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Land Type Filter */}
          <AccordionItem value="landType">
            <AccordionTrigger>Land Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {LAND_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={landType.includes(type.value)}
                      onChange={() => updateLandType(type.value)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Location Filter */}
          <AccordionItem value="location">
            <AccordionTrigger>Location</AccordionTrigger>
            <AccordionContent>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search location..."
                  className="pl-10"
                  value={location}
                  onChange={(e) => updateLocation(e.target.value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Rent Range Filter */}
          <AccordionItem value="rentRange">
            <AccordionTrigger>Rent Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Min"
                    value={rentMin || ''}
                    onChange={(e) => updateRentRange(parseInt(e.target.value) || 0, rentMax)}
                    className="h-8"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={rentMax || ''}
                    onChange={(e) => updateRentRange(rentMin, parseInt(e.target.value) || 100000)}
                    className="h-8"
                  />
                </div>
                <Slider
                  min={0}
                  max={100000}
                  step={1000}
                  value={[rentMin, rentMax]}
                  onValueChange={([min, max]) => updateRentRange(min, max)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹1,00,000</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Apply Button */}
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}