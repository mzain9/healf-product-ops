'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface ProductOwnerItem {
  id: number
  name: string
  slug: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export function useOwners(): {
  owners: ProductOwnerItem[]
  loading: boolean
  error: Error | null
} {
  const [owners, setOwners] = useState<ProductOwnerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetchOwners = async () => {
      try {
        const res = await fetch('/api/owners')
        if (!res.ok) throw new Error('Failed to fetch owners')
        const data = await res.json() as Array<{ id: number; name: string; slug: string; email: string; createdAt: string; updatedAt: string; _count?: { products: number } }>
        if (!cancelled) {
          setOwners(data.map((o) => ({
            ...o,
            createdAt: new Date(o.createdAt),
            updatedAt: new Date(o.updatedAt),
          })))
          setError(null)
        }
      } catch (err) {
        const e = err instanceof Error ? err : new Error('Failed to fetch owners')
        if (!cancelled) {
          setError(e)
          setOwners([])
          toast.error('Failed to load product owners')
        }
        console.error('Error fetching owners:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchOwners()
    return () => {
      cancelled = true
    }
  }, [])

  return { owners, loading, error }
}
