'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Trash2,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PRODUCT_STATUS_LABELS } from '@/lib/constants'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/currency'

export type SortField = 'name' | 'sku' | 'price' | 'inventory' | 'status' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export interface ProductTableRow {
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

const SKELETON_ROW_COUNT = 10

const COLUMN_LAYOUT = [
  { width: 'w-14 shrink-0', align: 'left' as const },
  { width: 'w-[160px] shrink-0', align: 'left' as const },
  { width: 'w-[100px] shrink-0', align: 'left' as const },
  { width: 'w-[120px] shrink-0', align: 'left' as const },
  { width: 'w-[84px] shrink-0', align: 'center' as const },
  { width: 'w-[72px] shrink-0', align: 'center' as const },
  { width: 'w-[100px] shrink-0', align: 'center' as const },
  { width: 'w-[100px] shrink-0', align: 'center' as const },
  { width: 'w-[120px] shrink-0', align: 'center' as const },
] as const

interface ProductsTableProps {
  initialProducts: ProductTableRow[]
  total: number
  totalPages: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  sortBy: SortField
  sortOrder: SortOrder
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void
  loading?: boolean
  onDeleteSuccess?: () => void
}

const SORTABLE_COLUMNS: { key: SortField; label: string; align?: 'center' }[] = [
  { key: 'name', label: 'Product' },
  { key: 'sku', label: 'SKU' },
  { key: 'price', label: 'Price', align: 'center' },
  { key: 'inventory', label: 'Stock', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'createdAt', label: 'Created', align: 'center' },
]
const COLUMN_COUNT = COLUMN_LAYOUT.length

function SortableHead({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
  align,
  widthClass,
}: {
  label: string
  sortKey: SortField
  currentSortBy: SortField
  currentSortOrder: SortOrder
  onSort: (sortBy: SortField, sortOrder: SortOrder) => void
  align?: 'center'
  widthClass: string
}) {
  const isActive = currentSortBy === sortKey
  const handleClick = () => {
    onSort(sortKey, isActive && currentSortOrder === 'asc' ? 'desc' : 'asc')
  }

  const ariaSort = isActive
    ? (currentSortOrder === 'asc'
        ? ('ascending' as const)
        : ('descending' as const))
    : ('none' as const)

  return (
    <TableHead
      className={cn(widthClass, align === 'center' && 'text-center')}
      aria-sort={ariaSort}
    >
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 font-semibold text-foreground hover:bg-muted/80 hover:text-foreground',
          align === 'center' ? 'mx-auto' : '-ml-2'
        )}
        onClick={handleClick}
        aria-label={`Sort by ${label} ${isActive && currentSortOrder === 'desc' ? 'ascending' : 'descending'}`}
      >
        {label}
        <span className="ml-1 flex items-center -space-x-0.5">
          <ArrowUp
            className={cn(
              'h-3.5 w-3 shrink-0',
              isActive && currentSortOrder === 'asc'
                ? 'text-foreground'
                : 'text-muted-foreground opacity-50'
            )}
          />
          <ArrowDown
            className={cn(
              'h-3.5 w-3 shrink-0',
              isActive && currentSortOrder === 'desc'
                ? 'text-foreground'
                : 'text-muted-foreground opacity-50'
            )}
          />
        </span>
      </Button>
    </TableHead>
  )
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'ACTIVE':
      return 'default'
    case 'INACTIVE':
      return 'secondary'
    case 'DISCONTINUED':
      return 'destructive'
    default:
      return 'outline'
  }
}

function SkeletonRow() {
  return (
    <TableRow className="border-border">
      <TableCell className={cn(COLUMN_LAYOUT[0].width, 'py-3')}>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[1].width, 'py-3')}>
        <Skeleton className="h-4 w-full max-w-[100px]" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[2].width, 'py-3')}>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[3].width, 'py-3')}>
        <Skeleton className="h-4 w-[90px]" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[4].width, 'py-3 text-center')}>
        <Skeleton className="mx-auto h-4 w-14" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[5].width, 'py-3 text-center')}>
        <Skeleton className="mx-auto h-4 w-8" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[6].width, 'py-3 text-center')}>
        <Skeleton className="mx-auto h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[7].width, 'py-3 text-center')}>
        <Skeleton className="mx-auto h-4 w-20" />
      </TableCell>
      <TableCell className={cn(COLUMN_LAYOUT[8].width, 'py-3 text-center')}>
        <div className="flex justify-center gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  )
}

export function ProductsTable({
  initialProducts,
  total,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  sortBy,
  sortOrder,
  onSortChange,
  loading = false,
  onDeleteSuccess,
}: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const handleDelete = async () => {
    if (deleteProductId === null) return
    setIsDeleting(true)
    try {
      const product = products.find((p) => p.id === deleteProductId)
      if (!product) return
      const res = await fetch(`/api/products/${product.slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete product')
      toast.success('Product deleted successfully')
      setDeleteProductId(null)
      onDeleteSuccess?.()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, total)

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const delta = 2
    const range: number[] = []
    const out: (number | 'ellipsis')[] = []
    let prev: number | undefined
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }
    for (const n of range) {
      if (prev !== undefined && n - prev > 1) out.push('ellipsis')
      out.push(n)
      prev = n
    }
    return out
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Mobile card list */}
        <div className="space-y-3 p-3 md:hidden">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-border p-4">
                <div className="flex gap-3">
                  <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </Card>
            ))
          ) : products.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No products found
            </p>
          ) : (
            products.map((product) => (
              <Card
                key={product.id}
                className="border-border p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-medium text-muted-foreground">
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground" title={product.name}>
                      {product.name}
                    </p>
                    <p className="truncate text-xs font-mono text-muted-foreground" title={product.sku}>
                      {product.sku}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant={getStatusVariant(product.status)} className="text-xs">
                        {PRODUCT_STATUS_LABELS[product.status as keyof typeof PRODUCT_STATUS_LABELS] ?? product.status}
                      </Badge>
                      <span className="text-sm font-medium tabular-nums text-foreground">
                        ${formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        · {product.inventory} in stock
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2" asChild>
                        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2" asChild>
                        <Link href={`/products/${product.slug}/edit`} aria-label={`Edit ${product.name}`}>
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteProductId(product.id)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <Table className="table-fixed w-full min-w-[900px]">
            <TableHeader>
              <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                <TableHead className={cn(COLUMN_LAYOUT[0].width, 'text-muted-foreground font-medium')}>
                  Image
                </TableHead>
                {SORTABLE_COLUMNS.slice(0, 2).map((col, i) => (
                  <SortableHead
                    key={col.key}
                    label={col.label}
                    sortKey={col.key}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={onSortChange}
                    align={col.align}
                    widthClass={COLUMN_LAYOUT[i + 1].width}
                  />
                ))}
                <TableHead className={cn(COLUMN_LAYOUT[3].width, 'text-muted-foreground font-medium')}>
                  Owner
                </TableHead>
                {SORTABLE_COLUMNS.slice(2).map((col, i) => (
                  <SortableHead
                    key={col.key}
                    label={col.label}
                    sortKey={col.key}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={onSortChange}
                    align={col.align}
                    widthClass={COLUMN_LAYOUT[i + 4].width}
                  />
                ))}
                <TableHead
                  className={cn(
                    COLUMN_LAYOUT[8].width,
                    'text-center text-muted-foreground font-medium'
                  )}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className={cn(COLUMN_LAYOUT[0].width, 'py-3')}>
                      {product.imageUrl ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-xs font-medium text-muted-foreground">
                          {product.name.charAt(0)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        COLUMN_LAYOUT[1].width,
                        'py-3 font-medium text-foreground truncate'
                      )}
                      title={product.name}
                    >
                      {product.name}
                    </TableCell>
                    <TableCell
                      className={cn(COLUMN_LAYOUT[2].width, 'py-3 font-mono text-sm text-muted-foreground truncate')}
                      title={product.sku}
                    >
                      {product.sku}
                    </TableCell>
                    <TableCell
                      className={cn(COLUMN_LAYOUT[3].width, 'py-3 text-sm text-muted-foreground truncate')}
                      title={product.owner.name}
                    >
                      {product.owner.name}
                    </TableCell>
                    <TableCell className={cn(COLUMN_LAYOUT[4].width, 'py-3 text-center font-medium tabular-nums')}>
                      ${formatPrice(product.price)}
                    </TableCell>
                    <TableCell className={cn(COLUMN_LAYOUT[5].width, 'py-3 text-center tabular-nums')}>
                      <span
                        className={
                          product.inventory < 20
                            ? 'font-medium text-destructive'
                            : 'text-muted-foreground'
                        }
                      >
                        {product.inventory}
                      </span>
                    </TableCell>
                    <TableCell className={cn(COLUMN_LAYOUT[6].width, 'py-3 text-center')}>
                      <Badge variant={getStatusVariant(product.status)} className="font-medium">
                        {PRODUCT_STATUS_LABELS[product.status as keyof typeof PRODUCT_STATUS_LABELS] ?? product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(COLUMN_LAYOUT[7].width, 'py-3 text-center text-muted-foreground text-sm')}>
                      {new Date(product.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className={cn(COLUMN_LAYOUT[8].width, 'py-3 text-center')}>
                      <div className="flex justify-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          asChild
                        >
                          <Link href={`/products/${product.slug}`} title="View" aria-label={`View product ${product.name}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          asChild
                        >
                          <Link href={`/products/${product.slug}/edit`} title="Edit" aria-label={`Edit product ${product.name}`}>
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteProductId(product.id)}
                          title="Delete"
                          aria-label={`Delete product ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - show for both mobile and desktop */}
        {loading ? (
          <div className="flex flex-col gap-4 border-t border-border bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        ) : total > 0 ? (
          <div className="flex flex-col gap-4 border-t border-border bg-muted/20 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
              Showing <span className="font-medium text-foreground">{start}</span> to{' '}
              <span className="font-medium text-foreground">{end}</span> of{' '}
              <span className="font-medium text-foreground">{total}</span> results
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:justify-end">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-0.5">
                {getPageNumbers().map((page, i) =>
                  page === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="flex h-9 w-9 items-center justify-center text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="icon"
                      className="h-9 w-9 shrink-0 min-w-9"
                      onClick={() => onPageChange(page)}
                      aria-label={currentPage === page ? `Page ${page}, current page` : `Go to page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <AlertDialog open={deleteProductId !== null} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete product</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product.
          </AlertDialogDescription>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90 hover:text-white"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
