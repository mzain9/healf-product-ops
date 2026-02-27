import { prisma } from '@/lib/db'

const LOW_STOCK_THRESHOLD = 20
const PRODUCTS_OVER_TIME_MONTHS = 6
const LOW_STOCK_LIMIT = 15
const RECENT_PRODUCTS_LIMIT = 5
const TOP_OWNERS_LIMIT = 5

export interface DashboardStats {
  totalProducts: number
  totalOwners: number
  activeProducts: number
  inactiveProducts: number
  discontinuedProducts: number
  lowInventoryCount: number
  totalInventoryValue: number
}

export interface StatusCount {
  name: string
  value: number
  fill: string
}

export interface ProductsOverTimePoint {
  period: string
  count: number
  fullDate: string
}

export interface ProductsByOwnerRow {
  ownerName: string
  count: number
  value: number
}

export interface LowStockProduct {
  id: number
  slug: string
  name: string
  sku: string
  inventory: number
  price: number
}

export interface RecentProduct {
  id: number
  slug: string
  name: string
  sku: string
  status: string
  ownerName: string
  createdAt: Date
}

const EMPTY_STATS: DashboardStats = {
  totalProducts: 0,
  totalOwners: 0,
  activeProducts: 0,
  inactiveProducts: 0,
  discontinuedProducts: 0,
  lowInventoryCount: 0,
  totalInventoryValue: 0,
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      totalProducts,
      totalOwners,
      activeProducts,
      inactiveProducts,
      discontinuedProducts,
      lowInventoryCount,
      inventoryValueResult,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.productOwner.count(),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.product.count({ where: { status: 'INACTIVE' } }),
      prisma.product.count({ where: { status: 'DISCONTINUED' } }),
      prisma.product.count({ where: { inventory: { lt: LOW_STOCK_THRESHOLD } } }),
      prisma.$queryRaw<[{ sum: unknown }]>`
        SELECT SUM(price * inventory) as sum FROM products
      `,
    ])

    const rawSum = inventoryValueResult[0]?.sum
    const totalInventoryValue = typeof rawSum === 'number' ? rawSum : Number(String(rawSum ?? 0))

    return {
      totalProducts,
      totalOwners,
      activeProducts,
      inactiveProducts,
      discontinuedProducts,
      lowInventoryCount,
      totalInventoryValue,
    }
  } catch (error) {
    console.error('getDashboardStats error:', error)
    return EMPTY_STATS
  }
}

export async function getStatusCounts(): Promise<StatusCount[]> {
  try {
    const [active, inactive, discontinued] = await Promise.all([
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.product.count({ where: { status: 'INACTIVE' } }),
      prisma.product.count({ where: { status: 'DISCONTINUED' } }),
    ])
    return [
      { name: 'Active', value: active, fill: 'var(--color-chart-1)' },
      { name: 'Inactive', value: inactive, fill: 'var(--color-chart-2)' },
      { name: 'Discontinued', value: discontinued, fill: 'var(--color-chart-3)' },
    ]
  } catch (error) {
    console.error('getStatusCounts error:', error)
    return []
  }
}

export async function getProductsOverTime(
  months: number = PRODUCTS_OVER_TIME_MONTHS
): Promise<ProductsOverTimePoint[]> {
  try {
    const safeMonths = typeof months === 'number' && months >= 1 ? months : 1
    const since = new Date()
    since.setMonth(since.getMonth() - safeMonths)
    const rows = await prisma.$queryRaw<
      { month: Date; count: bigint }[]
    >`
      SELECT date_trunc('month', "createdAt")::date as month, COUNT(*)::bigint as count
      FROM products
      WHERE "createdAt" >= ${since}
      GROUP BY date_trunc('month', "createdAt")
      ORDER BY 1
    `
    return rows.map((r: { month: Date; count: bigint }) => ({
      period: new Date(r.month).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      count: Number(r.count),
      fullDate: new Date(r.month).toISOString().slice(0, 7),
    }))
  } catch (error) {
    console.error('getProductsOverTime error:', error)
    return []
  }
}

export async function getProductsByOwner(): Promise<ProductsByOwnerRow[]> {
  try {
    const valueByOwner = await prisma.$queryRaw<
      { owner_name: string; product_count: bigint; total_value: unknown }[]
    >`
      SELECT o.name AS owner_name,
             COUNT(p.id)::bigint AS product_count,
             COALESCE(SUM(p.price * p.inventory), 0) AS total_value
      FROM product_owners o
      LEFT JOIN products p ON p."ownerId" = o.id
      GROUP BY o.id, o.name
    `
    const rows: ProductsByOwnerRow[] = valueByOwner.map((r: { owner_name: string; product_count: bigint; total_value: unknown }) => ({
      ownerName: r.owner_name,
      count: Number(r.product_count),
      value: typeof r.total_value === 'number' ? r.total_value : Number(String(r.total_value ?? 0)),
    }))
    return rows.sort((a, b) => b.count - a.count).slice(0, TOP_OWNERS_LIMIT)
  } catch (error) {
    console.error('getProductsByOwner error:', error)
    return []
  }
}

export async function getLowStockProducts(
  limit: number = LOW_STOCK_LIMIT
): Promise<LowStockProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { inventory: { lt: LOW_STOCK_THRESHOLD } },
      orderBy: { inventory: 'asc' },
      take: limit,
      select: { id: true, slug: true, name: true, sku: true, inventory: true, price: true },
    })
    return products.map((p: { id: number; slug: string; name: string; sku: string; inventory: number; price: unknown }) => ({
      ...p,
      price: typeof p.price === 'object' && p.price != null && 'toNumber' in (p.price as object) ? (p.price as { toNumber(): number }).toNumber() : Number(p.price),
    }))
  } catch (error) {
    console.error('getLowStockProducts error:', error)
    return []
  }
}

export async function getRecentProducts(
  limit: number = RECENT_PRODUCTS_LIMIT
): Promise<RecentProduct[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        sku: true,
        status: true,
        createdAt: true,
        owner: { select: { name: true } },
      },
    })
    return products.map(
      (p: (typeof products)[number]): RecentProduct => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        status: p.status,
        ownerName: p.owner.name,
        createdAt: p.createdAt,
      })
    )
  } catch (error) {
    console.error('getRecentProducts error:', error)
    return []
  }
}
