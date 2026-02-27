import { Card } from '@/components/ui/card'

export default function OwnersLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <header>
        <div className="h-8 w-40 animate-pulse rounded bg-muted sm:h-9 sm:w-48" />
        <div className="mt-2 h-4 w-56 animate-pulse rounded bg-muted sm:h-5 sm:w-72" />
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-border p-4 sm:p-6">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-9 w-24 animate-pulse rounded bg-muted" />
          </Card>
        ))}
      </div>
    </div>
  )
}
