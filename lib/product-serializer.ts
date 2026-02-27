export function serializeProduct<T extends { price: unknown; createdAt: Date; updatedAt: Date; owner?: { createdAt: Date; updatedAt: Date } }>(p: T) {
  return {
    ...p,
    price: typeof p.price === 'object' && p.price != null && 'toString' in (p.price as object) ? (p.price as { toString(): string }).toString() : String(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    ...(p.owner && {
      owner: {
        ...p.owner,
        createdAt: p.owner.createdAt.toISOString(),
        updatedAt: p.owner.updatedAt.toISOString(),
      },
    }),
  }
}
