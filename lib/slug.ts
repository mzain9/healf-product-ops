const MAX_SLUG_ITERATIONS = 1000

type PrismaLike = {
  product: { findUnique: (args: { where: { slug: string } }) => Promise<{ id: number } | null> }
  productOwner: { findUnique: (args: { where: { slug: string } }) => Promise<{ id: number } | null> }
}

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'item'
}

export async function uniqueProductSlug(
  prisma: PrismaLike,
  baseSlug: string,
  excludeId?: number
): Promise<string> {
  let slug = baseSlug
  let n = 2
  let iterations = 0
  while (iterations < MAX_SLUG_ITERATIONS) {
    iterations += 1
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (!existing || (excludeId != null && existing.id === excludeId)) return slug
    slug = `${baseSlug}-${n}`
    n += 1
  }
  return `${baseSlug}-${Date.now()}`
}

export async function uniqueOwnerSlug(
  prisma: PrismaLike,
  baseSlug: string
): Promise<string> {
  let slug = baseSlug
  let n = 2
  let iterations = 0
  while (iterations < MAX_SLUG_ITERATIONS) {
    iterations += 1
    const existing = await prisma.productOwner.findUnique({ where: { slug } })
    if (!existing) return slug
    slug = `${baseSlug}-${n}`
    n += 1
  }
  return `${baseSlug}-${Date.now()}`
}
