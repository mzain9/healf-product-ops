'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4 sm:p-6">
      <Card className="border-border w-full max-w-md p-6 text-center sm:p-8">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive sm:h-12 sm:w-12" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-foreground sm:text-xl">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to dashboard</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
