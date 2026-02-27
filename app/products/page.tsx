import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { ProductsContent } from './products-content'

export const metadata = {
  title: 'Products',
  description: 'Manage and view product inventory',
}

function ProductsFallback() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-foreground">Products</h1>
        <p className="mt-2 text-muted-foreground">Manage and view product inventory</p>
      </header>
      <Card className="border-border p-12 text-center">
        <div className="space-y-2">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="font-medium text-muted-foreground">Loading products…</p>
        </div>
      </Card>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsContent />
    </Suspense>
  )
}
