import { NextResponse } from 'next/server'

export function apiErrorResponse(
  error: string,
  status: number,
  details?: unknown
): NextResponse {
  const body = details !== undefined ? { error, details } : { error }
  return NextResponse.json(body, { status })
}
