import Link from 'next/link'
import type { LowStockProduct } from '@/lib/dashboard'
import { formatPrice } from '@/lib/currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle } from 'lucide-react'

interface LowStockAlertsProps {
  products: LowStockProduct[]
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Low stock alerts
        </CardTitle>
        <Link href="/products?sortBy=inventory&sortOrder=asc">
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {!products.length ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No low stock items
          </p>
        ) : (
          <div className="max-h-[290px] overflow-y-auto rounded-md border border-border">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.sku}</TableCell>
                  <TableCell className="text-right text-amber-600 dark:text-amber-400">
                    {p.inventory}
                  </TableCell>
                  <TableCell className="text-right">${formatPrice(p.price)}</TableCell>
                  <TableCell>
                    <Link href={`/products/${p.slug}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
