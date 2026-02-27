import { Card } from '@/components/ui/card'

export default function EditProductLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="h-9 w-24 animate-pulse rounded bg-muted sm:h-10" />
      <Card className="border-border p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted sm:col-span-2" />
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-4 flex gap-3 border-t border-border pt-4 sm:mt-6 sm:pt-6">
          <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-20 animate-pulse rounded bg-muted" />
        </div>
      </Card>
    </div>
  )
}
