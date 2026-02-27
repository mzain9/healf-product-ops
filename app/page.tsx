import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Package,
  Users,
  AlertTriangle,
  CheckCircle,
  DollarSign,
} from 'lucide-react'
import {
  getDashboardStats,
  getStatusCounts,
  getProductsOverTime,
  getProductsByOwner,
  getLowStockProducts,
  getRecentProducts,
} from '@/lib/dashboard'
import { StatusDonut } from '@/components/dashboard/status-donut'
import { ProductsOverTimeChart } from '@/components/dashboard/products-over-time-chart'
import { ProductsByOwnerChart } from '@/components/dashboard/products-by-owner-chart'
import { LowStockAlerts } from '@/components/dashboard/low-stock-alerts'
import { RecentProducts } from '@/components/dashboard/recent-products'

export const metadata = {
  title: 'Dashboard',
  description: 'Product management overview',
}

export default async function HomePage() {
  const [
    stats,
    statusCounts,
    productsOverTime,
    productsByOwner,
    lowStockProducts,
    recentProducts,
  ] = await Promise.all([
    getDashboardStats(),
    getStatusCounts(),
    getProductsOverTime(),
    getProductsByOwner(),
    getLowStockProducts(),
    getRecentProducts(),
  ])

  const kpiCards = [
    {
      label: 'Total products',
      value: stats.totalProducts,
      icon: Package,
      className: 'bg-primary/10 text-primary',
    },
    {
      label: 'Product owners',
      value: stats.totalOwners,
      icon: Users,
      className: 'bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Active products',
      value: stats.activeProducts,
      icon: CheckCircle,
      className: 'bg-green-100/50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      label: 'Low stock items',
      value: stats.lowInventoryCount,
      icon: AlertTriangle,
      className: 'bg-amber-100/50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Total inventory value',
      value: `$${stats.totalInventoryValue.toFixed(2)}`,
      icon: DollarSign,
      className: 'bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    },
  ] as const

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2 sm:text-base">
            Product management overview
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link href="/products/new">
            <Button className="gap-2">
              <Package className="h-4 w-4" />
              Add product
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              <Package className="h-4 w-4" />
              View all products
            </Button>
          </Link>
          <Link href="/owners">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Manage owners
            </Button>
          </Link>
        </nav>
      </header>

      <section>
        <h2 className="sr-only">Key metrics</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {kpiCards.map(({ label, value, icon: Icon, className }) => (
            <li key={label}>
              <Card className="border-border p-4 transition-shadow hover:shadow-md sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                      {label}
                    </p>
                    <p className="mt-1 truncate text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                      {value}
                    </p>
                  </div>
                  <div className={`shrink-0 rounded-lg p-2 sm:p-2.5 ${className}`}>
                    <Icon className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <StatusDonut data={statusCounts} />
        <ProductsOverTimeChart data={productsOverTime} />
        <ProductsByOwnerChart data={productsByOwner} />
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <LowStockAlerts products={lowStockProducts} />
        <RecentProducts products={recentProducts} />
      </section>
    </div>
  )
}
