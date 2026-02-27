import { prisma } from '@/lib/db'

export async function getOwners() {
  return prisma.productOwner.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })
}
