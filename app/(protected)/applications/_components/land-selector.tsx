// app/(protected)/applications/_components/land-selector.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Use the same Land type as in types/land.types.ts
export interface Land {
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
  landownerId: string
  createdAt: Date
  updatedAt: Date
}

interface LandSelectorProps {
  onSelect: (land: Land) => void
  preSelectedOwnerId?: string | null
}

export function LandSelector({ onSelect, preSelectedOwnerId }: LandSelectorProps) {
  const [lands, setLands] = useState<Land[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  const fetchLands = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (preSelectedOwnerId) params.append('ownerId', preSelectedOwnerId)
      params.append('isActive', 'true')
      params.append('isArchived', 'false')
      
      const res = await fetch(`/api/lands?${params.toString()}`)
      const data = await res.json()
      setLands(data.lands || [])
    } catch (error) {
      console.error('Failed to fetch lands:', error)
    } finally {
      setLoading(false)
    }
  }, [preSelectedOwnerId])
  
  useEffect(() => {
    fetchLands()
  }, [fetchLands])
  
  const filteredLands = lands.filter(land => 
    land.title.toLowerCase().includes(search.toLowerCase()) ||
    land.village?.toLowerCase().includes(search.toLowerCase()) ||
    land.district?.toLowerCase().includes(search.toLowerCase())
  )
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search lands by name, village, or district..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="grid gap-4 max-h-[400px] overflow-y-auto">
        {filteredLands.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No lands available
          </div>
        ) : (
          filteredLands.map((land) => (
            <Card key={land.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{land.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {[land.village, land.district, land.state].filter(Boolean).join(', ')}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>Size: {land.size} acres</span>
                      <span>Type: {land.landType}</span>
                      <span>Duration: {land.minLeaseDuration}-{land.maxLeaseDuration} months</span>
                    </div>
                  </div>
                  <Button onClick={() => onSelect(land)}>
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}