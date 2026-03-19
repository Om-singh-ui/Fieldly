// lib/constants.ts
export const LAND_TYPES = [
  'AGRICULTURAL',
  'FALLOW',
  'ORCHARD',
  'PASTURE',
  'VINEYARD',
  'GREENHOUSE',
] as const

export const SORT_OPTIONS = [
  { value: 'hotnessScore', label: 'Hotness Score' },
  { value: 'newest', label: 'Newest First' },
  { value: 'endingSoon', label: 'Ending Soon' },
  { value: 'priceLowToHigh', label: 'Price: Low to High' },
  { value: 'priceHighToLow', label: 'Price: High to Low' },
  { value: 'mostBids', label: 'Most Bids' },
] as const

export const BID_INCREMENT = 1000
export const AUTO_EXTEND_MINUTES = 5
export const LISTINGS_PER_PAGE = 12