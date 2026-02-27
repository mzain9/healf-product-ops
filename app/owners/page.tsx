import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getOwners } from '@/lib/owners'

export const metadata = {
  title: 'Product owners',
  description: 'Manage product owners',
}

export default async function OwnersPage() {
  const owners = await getOwners()

  return (
    <div className="space-y-4 sm:space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Product owners
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          View and manage product owners
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {owners.length === 0 ? (
          <li className="col-span-full">
            <Card className="border-border p-6 text-center sm:p-8">
              <p className="text-sm text-muted-foreground sm:text-base">No product owners found</p>
            </Card>
          </li>
        ) : (
          owners.map((owner) => (
            <li key={owner.id}>
              <Card className="border-border p-4 sm:p-6">
                <div className="mb-3 flex items-center gap-3 sm:mb-4 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                    <Users className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground">{owner.name}</h3>
                    <p className="truncate text-xs text-muted-foreground sm:text-sm">{owner.email}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-3 sm:pt-4">
                  <Button variant="outline" size="sm" className="w-full gap-2 border-border" asChild>
                    <Link href={`/products?owner=${owner.slug}`}>
                      <span className="font-semibold text-foreground">
                        {owner._count.products}
                      </span>{' '}
                      {owner._count.products === 1 ? 'product' : 'products'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
