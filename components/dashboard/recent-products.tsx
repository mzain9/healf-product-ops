import Link from 'next/link'
import type { RecentProduct } from '@/lib/dashboard'
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
import { Package } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RecentProductsProps {
  products: RecentProduct[]
}

export function RecentProducts({ products }: RecentProductsProps) {
  return (
    <Card className="border-border min-w-0">
      <CardHeader className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-4 w-4 shrink-0" />
          Recent products
        </CardTitle>
        <Link href="/products">
          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {products.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No products yet
          </p>
        ) : (
          <div className="max-h-[260px] overflow-auto rounded-md border border-border sm:max-h-[290px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Product</TableHead>
                  <TableHead className="hidden text-muted-foreground sm:table-cell sm:text-sm">Owner</TableHead>
                  <TableHead className="text-xs text-muted-foreground sm:text-sm">Added</TableHead>
                  <TableHead className="w-0" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="max-w-[120px] truncate font-medium sm:max-w-none">{p.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">{p.ownerName}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
                      {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                    </TableCell>
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
