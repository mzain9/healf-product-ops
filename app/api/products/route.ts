import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@/lib/generated/prisma/client'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { slugify, uniqueProductSlug } from '@/lib/slug'
import {
  parseProductsQuery,
  resolveOwnerIds,
  buildProductsWhere,
} from '@/lib/products-api-query'
import { createProductSchema } from '@/lib/product-validation'
import { serializeProduct } from '@/lib/product-serializer'
import { apiErrorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = parseProductsQuery(searchParams)
    const ownerIds = await resolveOwnerIds(parsed.ownerParams)
    const where = buildProductsWhere(parsed, ownerIds)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { owner: true },
        orderBy: { [parsed.sortBy]: parsed.sortOrder },
        skip: parsed.skip,
        take: parsed.limit,
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / parsed.limit)

    return NextResponse.json({
      data: products.map(serializeProduct),
      pagination: {
        page: parsed.page,
        limit: parsed.limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return apiErrorResponse('Failed to fetch products', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    const existingSku = await prisma.product.findUnique({
      where: { sku: validatedData.sku },
    })
    if (existingSku) {
      return apiErrorResponse('Product with this SKU already exists', 400)
    }

    const owner = await prisma.productOwner.findUnique({
      where: { id: validatedData.ownerId },
    })
    if (!owner) {
      return apiErrorResponse('Product owner not found', 404)
    }

    const slug = await uniqueProductSlug(prisma, slugify(validatedData.name))
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
        price: new Prisma.Decimal(validatedData.price),
        imageUrl: validatedData.imageUrl ?? undefined,
      },
      include: {
        owner: true,
      },
    })

    return NextResponse.json(serializeProduct(product), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiErrorResponse('Validation failed', 400, error.errors)
    }
    console.error('Error creating product:', error)
    return apiErrorResponse('Failed to create product', 500)
  }
}
