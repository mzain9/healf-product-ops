import { Card } from '@/components/ui/card'

export default function OwnersLoading() {
  return (
    <div className="space-y-6">
      <header>
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-5 w-72 animate-pulse rounded bg-muted" />
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-border p-6">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-9 w-24 animate-pulse rounded bg-muted" />
          </Card>
        ))}
      </div>
    </div>
  )
}
