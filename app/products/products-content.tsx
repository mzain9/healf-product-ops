'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProductsTable, type SortField, type SortOrder } from '@/components/products-table'
import { type FilterState } from '@/components/products-filters'
import { toast } from 'sonner'
import {
  SORTABLE_PRODUCT_FIELDS,
  SORT_ORDERS,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
} from '@/lib/constants'
import { useOwners } from '@/hooks/use-owners'

const PAGE_SIZE = 10

interface ProductWithOwner {
  id: number
  slug: string
  name: string
  sku: string
  description: string | null
  price: string
  inventory: number
  imageUrl: string | null
  status: string
  ownerId: number
  createdAt: string
  updatedAt: string
  owner: { name: string }
}

interface ProductsResponse {
  data: ProductWithOwner[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

function parseFilters(params: URLSearchParams): FilterState {
  const status = params.getAll('status').filter(Boolean)
  const owner = params.getAll('owner').filter(Boolean)
  const rawSortBy = params.get('sortBy') ?? 'createdAt'
  const sortBy = SORTABLE_PRODUCT_FIELDS.includes(rawSortBy as (typeof SORTABLE_PRODUCT_FIELDS)[number])
    ? rawSortBy
    : 'createdAt'
  const rawSortOrder = params.get('sortOrder') ?? 'desc'
  const sortOrder = SORT_ORDERS.includes(rawSortOrder as (typeof SORT_ORDERS)[number])
    ? (rawSortOrder as 'asc' | 'desc')
    : 'desc'
  return {
    status: status.length > 0 ? status : undefined,
    owner: owner.length > 0 ? owner : undefined,
    sortBy,
    sortOrder,
  }
}

export function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<ProductWithOwner[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState(searchParams.get('search') ?? '')
  const [debouncedQuery] = useDebounce(query, 400)
  const [filters, setFilters] = useState<FilterState>(() => parseFilters(searchParams))
  const [filtersOpen, setFiltersOpen] = useState(
    () =>
      searchParams.getAll('status').length > 0 || searchParams.getAll('owner').length > 0
  )
  const { owners, loading: ownersLoading } = useOwners()
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(
    async (p: number, q: string, f: FilterState) => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', p.toString())
        params.set('limit', PAGE_SIZE.toString())
        if (q) params.set('search', q)
        f.status?.forEach((s) => params.append('status', s))
        f.owner?.forEach((o) => params.append('owner', o))
        if (f.sortBy) params.set('sortBy', f.sortBy)
        if (f.sortOrder) params.set('sortOrder', f.sortOrder)
        const res = await fetch(`/api/products?${params}`)
        if (!res.ok) throw new Error('Failed to fetch products')
        const data: ProductsResponse = await res.json()
        setProducts(data.data)
        setPage(data.pagination.page)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)
      } catch {
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? ''
    const targetSearch = debouncedQuery.trim()
    if (currentSearch === targetSearch) return
    const next = new URLSearchParams(searchParams)
    targetSearch ? next.set('search', targetSearch) : next.delete('search')
    next.set('page', '1')
    router.replace(`?${next}`)
  }, [debouncedQuery, searchParams, router])

  useEffect(() => {
    const p = parseInt(searchParams.get('page') ?? '1', 10)
    const q = searchParams.get('search') ?? ''
    setPage(p)
    setQuery(q)
    fetchProducts(p, q, filters)
  }, [searchParams, filters, fetchProducts])

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return
    const next = new URLSearchParams(searchParams)
    next.set('page', nextPage.toString())
    router.replace(`?${next}`)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSortChange = (sortBy: SortField, sortOrder: SortOrder) => {
    const next = new URLSearchParams(searchParams)
    next.set('sortBy', sortBy)
    next.set('sortOrder', sortOrder)
    next.set('page', '1')
    router.replace(`?${next}`)
    setFilters((f) => ({ ...f, sortBy, sortOrder }))
  }

  const updateUrlFromFilters = useCallback(
    (f: FilterState) => {
      const next = new URLSearchParams(searchParams)
      next.delete('status')
      next.delete('owner')
      f.status?.forEach((s) => next.append('status', s))
      f.owner?.forEach((o) => next.append('owner', o))
      if (f.sortBy) next.set('sortBy', f.sortBy)
      else next.delete('sortBy')
      if (f.sortOrder) next.set('sortOrder', f.sortOrder)
      else next.delete('sortOrder')
      next.set('page', '1')
      router.replace(`?${next}`)
    },
    [searchParams, router]
  )

  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters)
      updateUrlFromFilters(newFilters)
    },
    [updateUrlFromFilters]
  )

  const handleResetFilters = useCallback(() => {
    const alreadyReset =
      !filters.status?.length && !filters.owner?.length
    if (alreadyReset) {
      setFiltersOpen(false)
      return
    }
    const newFilters: FilterState = {
      ...filters,
      status: undefined,
      owner: undefined,
    }
    setFilters(newFilters)
    updateUrlFromFilters(newFilters)
    setFiltersOpen(false)
  }, [filters, updateUrlFromFilters])

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Products</h1>
          <p className="mt-2 text-muted-foreground">Manage and view product inventory</p>
        </div>
        <Link href="/products/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </Link>
      </header>

      <Card className="border-border px-4 py-3">
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
          <div className="relative flex-1 min-w-[160px] overflow-visible p-[3px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, SKU, or description..."
              className="h-9 w-full border-border bg-background pl-9 text-sm focus-visible:border-border"
              value={query}
              onChange={handleSearch}
              aria-label="Search products by name, SKU, or description"
            />
          </div>

          <div
            className={`shrink-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-out ${filtersOpen ? 'max-w-0 opacity-0' : 'max-w-[100px] opacity-100'
              }`}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 border-border text-sm"
              onClick={() => setFiltersOpen(true)}
              aria-expanded={filtersOpen}
              aria-haspopup="listbox"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
          </div>

          <div
            className={`shrink-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-out ${filtersOpen ? 'max-w-[380px] opacity-100' : 'max-w-0 opacity-0'
              }`}
          >
            <div
              className={`flex flex-nowrap items-center gap-2 transition-all duration-300 ease-out ${filtersOpen ? 'translate-x-0 opacity-100 delay-50' : 'translate-x-3 opacity-0 delay-0'
                }`}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-[120px] sm:w-[130px] justify-between border-border text-sm font-normal"
                  >
                    <span className="truncate">
                      {!filters.status?.length
                        ? 'Status'
                        : `Status (${filters.status.length})`}
                    </span>
                    <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[140px]">
                  {PRODUCT_STATUSES.map((s) => (
                    <DropdownMenuCheckboxItem
                      key={s}
                      checked={filters.status?.includes(s) ?? false}
                      onCheckedChange={(checked) => {
                        const next = new Set(filters.status ?? [])
                        if (checked) next.add(s)
                        else next.delete(s)
                        handleFiltersChange({
                          ...filters,
                          status: next.size > 0 ? [...next] : undefined,
                        })
                      }}
                    >
                      {PRODUCT_STATUS_LABELS[s]}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={ownersLoading}
                    className="h-9 w-[130px] sm:w-[150px] justify-between border-border text-sm font-normal"
                  >
                    <span className="truncate">
                      {!filters.owner?.length
                        ? 'Owner'
                        : `Owner (${filters.owner.length})`}
                    </span>
                    <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[280px] w-[180px] overflow-y-auto">
                  {owners.map((o) => (
                    <DropdownMenuCheckboxItem
                      key={o.id}
                      checked={filters.owner?.includes(o.slug) ?? false}
                      onCheckedChange={(checked) => {
                        const next = new Set(filters.owner ?? [])
                        if (checked) next.add(o.slug)
                        else next.delete(o.slug)
                        handleFiltersChange({
                          ...filters,
                          owner: next.size > 0 ? [...next] : undefined,
                        })
                      }}
                    >
                      {o.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={`h-9 shrink-0 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 text-sm ${filtersOpen ? 'delay-100' : 'delay-0'}`}
                onClick={handleResetFilters}
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {!loading && products.length === 0 ? (
        <Card className="border-border p-12 text-center">
          <p className="text-muted-foreground">No products found</p>
        </Card>
      ) : (
        <ProductsTable
          initialProducts={products}
          total={total}
          totalPages={totalPages}
          currentPage={page}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          sortBy={(filters.sortBy as SortField) || 'createdAt'}
          sortOrder={filters.sortOrder || 'desc'}
          onSortChange={handleSortChange}
          loading={loading}
          onDeleteSuccess={() => fetchProducts(page, searchParams.get('search') ?? '', filters)}
        />
      )}
    </div>
  )
}
