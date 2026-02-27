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
    <Card className="border-border min-w-0">
      <CardHeader className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
          Low stock alerts
        </CardTitle>
        <Link href="/products?sortBy=inventory&sortOrder=asc">
          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {!products.length ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No low stock items
          </p>
        ) : (
          <div className="max-h-[260px] overflow-auto rounded-md border border-border sm:max-h-[290px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Product</TableHead>
                  <TableHead className="hidden text-muted-foreground sm:table-cell">SKU</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Stock</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Price</TableHead>
                  <TableHead className="w-0" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="max-w-[100px] truncate font-medium sm:max-w-none">{p.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">{p.sku}</TableCell>
                    <TableCell className="text-right text-amber-600 dark:text-amber-400">
                      {p.inventory}
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm">${formatPrice(p.price)}</TableCell>
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
