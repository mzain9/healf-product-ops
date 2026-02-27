export const PRODUCT_STATUSES = ['ACTIVE', 'INACTIVE', 'DISCONTINUED'] as const
export type ProductStatusValue = (typeof PRODUCT_STATUSES)[number]

export const PRODUCT_STATUS_LABELS: Record<ProductStatusValue, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DISCONTINUED: 'Discontinued',
}

export const SORTABLE_PRODUCT_FIELDS = [
  'name',
  'sku',
  'price',
  'inventory',
  'status',
  'createdAt',
] as const
export type SortableProductField = (typeof SORTABLE_PRODUCT_FIELDS)[number]

export const SORT_ORDERS = ['asc', 'desc'] as const
export type SortOrderValue = (typeof SORT_ORDERS)[number]

export const PRODUCTS_API = {
  PAGE_DEFAULT: 1,
  LIMIT_DEFAULT: 10,
  LIMIT_MAX: 100,
} as const
