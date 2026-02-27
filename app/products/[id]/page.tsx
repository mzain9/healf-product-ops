import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getProduct } from '@/lib/products'
import { PRODUCT_STATUS_LABELS } from '@/lib/constants'
import { formatPrice } from '@/lib/currency'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  INACTIVE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  DISCONTINUED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id: idOrSlug } = await params
  const product = await getProduct(idOrSlug)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: `View details for ${product.name} (${product.sku})`,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id: idOrSlug } = await params
  const product = await getProduct(idOrSlug)
  if (!product) notFound()

  const statusStyle = STATUS_STYLES[product.status] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'

  return (
    <div className="space-y-4 sm:space-y-6">
      <Link href="/products" className="inline-block">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to products
        </Button>
      </Link>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {product.imageUrl && (
            <Card className="overflow-hidden border-border p-3 sm:p-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted sm:h-64 lg:h-96">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
          )}

          <Card className="border-border space-y-4 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                  {product.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku}</p>
              </div>
              <Badge className={cn('w-fit shrink-0', statusStyle)}>
                {PRODUCT_STATUS_LABELS[product.status as keyof typeof PRODUCT_STATUS_LABELS] ?? product.status}
              </Badge>
            </div>

            {product.description && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground sm:text-base">Description</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{product.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="mb-1 text-xs text-muted-foreground sm:text-sm">Price</p>
                <p className="text-lg font-bold text-foreground sm:text-2xl">
                  ${formatPrice(product.price)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground sm:text-sm">Inventory</p>
                <p className="text-lg font-bold text-foreground sm:text-2xl">{product.inventory} units</p>
              </div>
            </div>
          </Card>

          <Card className="border-border space-y-4 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-foreground sm:text-base">Additional information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  Created
                </p>
                <p className="text-foreground">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  Last updated
                </p>
                <p className="text-foreground">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-4 sm:space-y-6">
          <Card className="border-border p-4 sm:p-6">
            <h3 className="mb-3 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">Product owner</h3>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-sm font-medium text-foreground sm:text-base">{product.owner.name}</p>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{product.owner.email}</p>
            </div>
          </Card>

          <Card className="border-border p-4 sm:p-6">
            <h3 className="mb-3 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">Actions</h3>
            <Link href={`/products/${product.slug}/edit`} className="block">
              <Button className="w-full gap-2" size="sm">
                <Edit2 className="h-4 w-4 shrink-0" />
                Edit product
              </Button>
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}
