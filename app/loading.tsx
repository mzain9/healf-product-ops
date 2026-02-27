export default function Loading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="h-8 w-40 animate-pulse rounded bg-muted sm:h-9 sm:w-48" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-card sm:h-32" />
        ))}
      </div>
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-border bg-card sm:h-80" />
        <div className="h-64 animate-pulse rounded-xl border border-border bg-card sm:h-80" />
      </div>
    </div>
  )
}
