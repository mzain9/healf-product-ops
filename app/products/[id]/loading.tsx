import { Card } from '@/components/ui/card'

export default function ProductDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden border-border p-4">
            <div className="h-96 w-full animate-pulse rounded-lg bg-muted" />
          </Card>
          <Card className="border-border space-y-4 p-6">
            <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="h-16 animate-pulse rounded bg-muted" />
              <div className="h-16 animate-pulse rounded bg-muted" />
            </div>
          </Card>
        </div>
        <aside className="space-y-6">
          <Card className="border-border p-6">
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted" />
          </Card>
          <Card className="border-border p-6">
            <div className="h-8 w-full animate-pulse rounded bg-muted" />
          </Card>
        </aside>
      </div>
    </div>
  )
}
