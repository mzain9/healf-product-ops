import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4 sm:p-6">
      <Card className="border-border w-full max-w-md p-6 text-center sm:p-8">
        <FileQuestion className="mx-auto h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-foreground sm:text-xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">Products</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
