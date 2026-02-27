import { prisma } from '@/lib/db'

export type ProductWithOwner = NonNullable<
  Awaited<
    ReturnType<
      typeof prisma.product.findUnique<{
        where: { id: number }
        include: { owner: true }
      }>
    >
  >
>

export async function getProduct(idOrSlug: string): Promise<ProductWithOwner | null> {
  try {
    const id = parseInt(idOrSlug, 10)
    if (!Number.isNaN(id)) {
      return await prisma.product.findUnique({
        where: { id },
        include: { owner: true },
      })
    }
    return await prisma.product.findUnique({
      where: { slug: idOrSlug },
      include: { owner: true },
    })
  } catch {
    return null
  }
}
