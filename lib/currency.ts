type PriceLike = number | string | { toNumber(): number }

export function formatPrice(value: PriceLike | null | undefined): string {
  if (value == null) return '0.00'
  const n =
    typeof value === 'string'
      ? parseFloat(value)
      : typeof value === 'number'
        ? value
        : typeof (value as { toNumber?: () => number }).toNumber === 'function'
          ? (value as { toNumber(): number }).toNumber()
          : Number.NaN
  if (Number.isNaN(n)) return '0.00'
  return n.toFixed(2)
}

export function priceToNumber(value: unknown): number {
  if (value == null) return 0
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string') return parseFloat(value) || 0
  if (typeof (value as { toNumber?: () => number }).toNumber === 'function') return (value as { toNumber(): number }).toNumber()
  return 0
}
