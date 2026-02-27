import { Card } from '@/components/ui/card'

export default function EditProductLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-24 animate-pulse rounded bg-muted" />
      <Card className="border-border p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted sm:col-span-2" />
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-6 flex gap-3 border-t border-border pt-6">
          <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-20 animate-pulse rounded bg-muted" />
        </div>
      </Card>
    </div>
  )
}
