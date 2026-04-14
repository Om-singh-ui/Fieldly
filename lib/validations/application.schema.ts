// lib/validations/application.schema.ts
import { z } from 'zod'

const CONTACT_PATTERNS = {
  phone: /(\+91[-\s]?)?[6-9]\d{9}|\d{10,}/g,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  whatsapp: /whatsapp|wa\.me|@wa|\(\d{3}\)\s?\d{3}[-\s]?\d{4}/gi,
  social: /@[\w.]+|facebook\.com|instagram\.com|twitter\.com/gi
}

export function containsContactInfo(text: string): boolean {
  for (const pattern of Object.values(CONTACT_PATTERNS)) {
    if (pattern.test(text)) {
      return true
    }
  }
  return false
}

export const createApplicationSchema = z.object({
  landId: z.string().min(1, 'Land selection is required'),
  listingId: z.string().optional(),
  proposedRent: z.number()
    .min(0, 'Rent must be positive')
    .max(10000000, 'Rent exceeds maximum limit')
    .optional(),
  duration: z.number()
    .int('Duration must be a whole number')
    .min(1, 'Minimum duration is 1 month')
    .max(120, 'Maximum duration is 120 months'),
  cropPlan: z.string()
    .max(2000, 'Crop plan must be less than 2000 characters')
    .optional()
    .refine(
      (val) => !val || !containsContactInfo(val),
      { message: 'Crop plan cannot contain contact information' }
    ),
  message: z.string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional()
    .refine(
      (val) => !val || !containsContactInfo(val),
      { message: 'Message cannot contain contact information' }
    )
})

export const reviewApplicationSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reviewNotes: z.string()
    .max(1000, 'Review notes must be less than 1000 characters')
    .optional()
    .refine(
      (val) => !val || !containsContactInfo(val),
      { message: 'Review notes cannot contain contact information' }
    )
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type ReviewApplicationInput = z.infer<typeof reviewApplicationSchema>