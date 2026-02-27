import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import {
  PRODUCT_STATUSES,
  SORTABLE_PRODUCT_FIELDS,
  SORT_ORDERS,
  PRODUCTS_API,
} from '@/lib/constants'

export interface ProductsQueryParsed {
  page: number
  limit: number
  search: string | undefined
  statusList: (typeof PRODUCT_STATUSES)[number][]
  ownerIds: number[]
  sortBy: (typeof SORTABLE_PRODUCT_FIELDS)[number]
  sortOrder: (typeof SORT_ORDERS)[number]
  skip: number
}

export async function resolveOwnerIds(ownerParams: string[]): Promise<number[]> {
  if (ownerParams.length === 0) return []
  const ids: number[] = []
  const slugs: string[] = []
  for (const o of ownerParams) {
    const id = parseInt(o, 10)
    if (!Number.isNaN(id)) ids.push(id)
    else if (o.trim()) slugs.push(o.trim())
  }
  if (ids.length === 0 && slugs.length === 0) return []
  const where: Prisma.ProductOwnerWhereInput = {
    OR: [
      ...(ids.length > 0 ? [{ id: { in: ids } }] : []),
      ...(slugs.length > 0 ? [{ slug: { in: slugs } }] : []),
    ],
  }
  const owners = await prisma.productOwner.findMany({
    where,
    select: { id: true },
  })
  return [...new Set(owners.map((o: { id: number }) => o.id))]
}

export function parseProductsQuery(searchParams: URLSearchParams): Omit<ProductsQueryParsed, 'ownerIds'> & { ownerParams: string[] } {
  const rawPage = parseInt(searchParams.get('page') || String(PRODUCTS_API.PAGE_DEFAULT), 10)
  const rawLimit = parseInt(searchParams.get('limit') || String(PRODUCTS_API.LIMIT_DEFAULT), 10)
  const page = Number.isNaN(rawPage) || rawPage < 1 ? PRODUCTS_API.PAGE_DEFAULT : rawPage
  const limit = Number.isNaN(rawLimit)
    ? PRODUCTS_API.LIMIT_DEFAULT
    : Math.min(Math.max(1, rawLimit), PRODUCTS_API.LIMIT_MAX)

  const rawSearch = searchParams.get('search')?.trim()
  const search = rawSearch && rawSearch.length <= 500 ? rawSearch : undefined
  const statusList = searchParams.getAll('status').filter(Boolean) as string[]
  const validStatuses = statusList.filter((s): s is (typeof PRODUCT_STATUSES)[number] =>
    PRODUCT_STATUSES.includes(s as (typeof PRODUCT_STATUSES)[number])
  )
  const ownerParams = searchParams.getAll('owner').filter(Boolean)

  const rawSortBy = searchParams.get('sortBy') || 'createdAt'
  const sortBy = SORTABLE_PRODUCT_FIELDS.includes(rawSortBy as (typeof SORTABLE_PRODUCT_FIELDS)[number])
    ? (rawSortBy as (typeof SORTABLE_PRODUCT_FIELDS)[number])
    : 'createdAt'
  const rawSortOrder = searchParams.get('sortOrder') || 'desc'
  const sortOrder = SORT_ORDERS.includes(rawSortOrder as (typeof SORT_ORDERS)[number])
    ? (rawSortOrder as (typeof SORT_ORDERS)[number])
    : 'desc'

  const skip = (page - 1) * limit

  return {
    page,
    limit,
    search,
    statusList: validStatuses,
    ownerParams,
    sortBy,
    sortOrder,
    skip,
  }
}

export function buildProductsWhere(
  parsed: Omit<ProductsQueryParsed, 'ownerIds'> & { ownerParams: string[] },
  ownerIds: number[]
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {}
  if (parsed.search) {
    where.OR = [
      { name: { contains: parsed.search, mode: 'insensitive' } },
      { sku: { contains: parsed.search, mode: 'insensitive' } },
      { description: { contains: parsed.search, mode: 'insensitive' } },
    ]
  }
  if (parsed.statusList.length > 0) {
    where.status = { in: parsed.statusList }
  }
  if (ownerIds.length > 0) {
    where.ownerId = { in: ownerIds }
  }
  return where
}
