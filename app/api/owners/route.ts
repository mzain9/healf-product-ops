import { NextRequest, NextResponse } from 'next/server'
import { getOwners } from '@/lib/owners'
import { apiErrorResponse } from '@/lib/api-response'

export async function GET(_request: NextRequest) {
  try {
    const owners = await getOwners()
    const list = owners.map((o) => ({
      id: o.id,
      name: o.name,
      slug: o.slug,
      email: o.email,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      _count: o._count,
    }))
    return NextResponse.json(list)
  } catch (error) {
    console.error('Error fetching owners:', error)
    return apiErrorResponse('Failed to fetch owners', 500)
  }
}
