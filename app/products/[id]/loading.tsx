import { Card } from '@/components/ui/card'

export default function ProductDetailLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="h-9 w-28 animate-pulse rounded bg-muted sm:h-10 sm:w-32" />
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          <Card className="overflow-hidden border-border p-3 sm:p-4">
            <div className="h-48 w-full animate-pulse rounded-lg bg-muted sm:h-64 lg:h-96" />
          </Card>
          <Card className="border-border space-y-4 p-4 sm:p-6">
            <div className="h-7 w-2/3 animate-pulse rounded bg-muted sm:h-8" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="h-14 animate-pulse rounded bg-muted sm:h-16" />
              <div className="h-14 animate-pulse rounded bg-muted sm:h-16" />
            </div>
          </Card>
        </div>
        <aside className="space-y-4 sm:space-y-6">
          <Card className="border-border p-4 sm:p-6">
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted" />
          </Card>
          <Card className="border-border p-4 sm:p-6">
            <div className="h-8 w-full animate-pulse rounded bg-muted" />
          </Card>
        </aside>
      </div>
    </div>
  )
}
