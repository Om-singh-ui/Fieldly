// hooks/useMarketplace.ts
import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from './useDebounce'
import { MarketplaceFilters, MarketplaceFeedItem } from '@/types/marketplace'

interface UseMarketplaceReturn {
  listings: MarketplaceFeedItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  filters: MarketplaceFilters
  setFilters: (filters: MarketplaceFilters) => void
  loadMore: () => Promise<void>
  toggleSave: (listingId: string) => Promise<void>
  savedListings: Set<string>
}

export function useMarketplace(initialFilters: MarketplaceFilters = {}): UseMarketplaceReturn {
  const [listings, setListings] = useState<MarketplaceFeedItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters)
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set())
  
  const debouncedFilters = useDebounce(filters, 500)

  const fetchListings = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('page', pageNum.toString())
      params.append('limit', '12')
      
      if (debouncedFilters.search) params.append('search', debouncedFilters.search)
      if (debouncedFilters.minPrice) params.append('minPrice', debouncedFilters.minPrice.toString())
      if (debouncedFilters.maxPrice) params.append('maxPrice', debouncedFilters.maxPrice.toString())
      if (debouncedFilters.landType) params.append('landType', debouncedFilters.landType)
      if (debouncedFilters.state) params.append('state', debouncedFilters.state)
      if (debouncedFilters.district) params.append('district', debouncedFilters.district)
      if (debouncedFilters.minSize) params.append('minSize', debouncedFilters.minSize.toString())
      if (debouncedFilters.maxSize) params.append('maxSize', debouncedFilters.maxSize.toString())
      if (debouncedFilters.irrigation) params.append('irrigation', 'true')
      if (debouncedFilters.verifiedOnly) params.append('verifiedOnly', 'true')
      if (debouncedFilters.sortBy) params.append('sortBy', debouncedFilters.sortBy)

      const response = await fetch(`/api/marketplace/feed?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings')
      }

      const data = await response.json()
      
      setListings(prev => reset ? data.listings : [...prev, ...data.listings])
      setHasMore(data.pagination.page < data.pagination.pages)
      setPage(pageNum)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [debouncedFilters])

  // Load initial listings when filters change
  useEffect(() => {
    fetchListings(1, true)
  }, [debouncedFilters, fetchListings])

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchListings(page + 1)
    }
  }, [loading, hasMore, page, fetchListings])

  const toggleSave = useCallback(async (listingId: string) => {
    try {
      const response = await fetch('/api/marketplace/saved', {
        method: savedListings.has(listingId) ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      })

      if (!response.ok) throw new Error('Failed to toggle save')

      setSavedListings(prev => {
        const next = new Set(prev)
        if (next.has(listingId)) {
          next.delete(listingId)
        } else {
          next.add(listingId)
        }
        return next
      })
    } catch (err) {
      console.error('Error toggling save:', err)
    }
  }, [savedListings])

  return {
    listings,
    loading,
    error,
    hasMore,
    filters,
    setFilters,
    loadMore,
    toggleSave,
    savedListings,
  }
}