import { z } from 'zod'
import { PRODUCT_STATUSES } from '@/lib/constants'

const SKU_MAX_LENGTH = 50
const skuFormat = /^[A-Z0-9_-]+$/

export const imageUrlSchema = z
  .union([z.literal(''), z.string().url()])
  .optional()
  .transform((v) => (v === '' || v == null ? null : v))

const skuSchema = z
  .string()
  .min(1, 'SKU is required')
  .max(SKU_MAX_LENGTH, `SKU must be at most ${SKU_MAX_LENGTH} characters`)
  .transform((s) => s.trim().toUpperCase())
  .refine((s) => skuFormat.test(s), 'SKU can only contain letters, numbers, hyphens and underscores')

export const productFormSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(SKU_MAX_LENGTH).transform((s) => s.trim().toUpperCase()).refine((s) => skuFormat.test(s), 'SKU can only contain letters, numbers, hyphens and underscores'),
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().optional().transform((v) => (v == null || v === '' ? undefined : v)),
  price: z.coerce.number().nonnegative('Price cannot be negative'),
  inventory: z.coerce.number().int().nonnegative('Inventory cannot be negative'),
  imageUrl: imageUrlSchema,
  status: z.enum(PRODUCT_STATUSES),
  ownerId: z.coerce.number().int().positive('Owner is required'),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const createProductSchema = z.object({
  sku: skuSchema,
  name: z.string().min(1, 'Name is required').transform((s) => s.trim()).refine((s) => s.length > 0, 'Name is required'),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative('Price cannot be negative'),
  inventory: z.number().int().nonnegative('Inventory cannot be negative'),
  imageUrl: imageUrlSchema,
  status: z.enum(PRODUCT_STATUSES).default('ACTIVE'),
  ownerId: z.number().int().positive('Owner ID must be positive'),
})

export const updateProductSchema = z.object({
  sku: z.string().min(1).max(SKU_MAX_LENGTH).optional().transform((s) => (s == null || s === '' ? undefined : s.trim().toUpperCase())).refine((s) => s === undefined || skuFormat.test(s), 'SKU can only contain letters, numbers, hyphens and underscores'),
  name: z.string().min(1).optional().transform((s) => (s == null ? undefined : s.trim())).refine((s) => s == null || (typeof s === 'string' && s.length > 0), 'Name cannot be empty'),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative().optional(),
  inventory: z.number().int().nonnegative().optional(),
  imageUrl: imageUrlSchema,
  status: z.enum(PRODUCT_STATUSES).optional(),
  ownerId: z.number().int().positive().optional(),
})
