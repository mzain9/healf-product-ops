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
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Product owners</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage product owners
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {owners.length === 0 ? (
          <li className="col-span-full">
            <Card className="border-border p-8 text-center">
              <p className="text-muted-foreground">No product owners found</p>
            </Card>
          </li>
        ) : (
          owners.map((owner) => (
            <li key={owner.id}>
              <Card className="border-border p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{owner.name}</h3>
                    <p className="text-sm text-muted-foreground">{owner.email}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
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
