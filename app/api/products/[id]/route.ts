import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { Prisma as PrismaTypes } from '@prisma/client'
import { z } from 'zod'
import { slugify, uniqueProductSlug } from '@/lib/slug'
import { updateProductSchema } from '@/lib/product-validation'
import { serializeProduct } from '@/lib/product-serializer'
import { apiErrorResponse } from '@/lib/api-response'

async function resolveProduct(idOrSlug: string) {
  const id = parseInt(idOrSlug, 10)
  if (!Number.isNaN(id)) {
    return prisma.product.findUnique({ where: { id }, include: { owner: true } })
  }
  return prisma.product.findUnique({ where: { slug: idOrSlug }, include: { owner: true } })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idOrSlug } = await params
    const product = await resolveProduct(idOrSlug)
    if (!product) {
      return apiErrorResponse('Product not found', 404)
    }
    return NextResponse.json(serializeProduct(product))
  } catch (error) {
    console.error('Error fetching product:', error)
    return apiErrorResponse('Failed to fetch product', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idOrSlug } = await params
    const product = await resolveProduct(idOrSlug)
    if (!product) {
      return apiErrorResponse('Product not found', 404)
    }

    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    if (validatedData.ownerId && validatedData.ownerId !== product.ownerId) {
      const owner = await prisma.productOwner.findUnique({
        where: { id: validatedData.ownerId },
      })
      if (!owner) {
        return apiErrorResponse('Product owner not found', 404)
      }
    }

    if (validatedData.sku && validatedData.sku !== product.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: validatedData.sku },
      })
      if (existingSku) {
        return apiErrorResponse('Product with this SKU already exists', 400)
      }
    }

    const updateData: PrismaTypes.ProductUpdateInput = {}
    if (validatedData.sku != null) updateData.sku = validatedData.sku
    if (validatedData.name != null) {
      updateData.name = validatedData.name.trim()
      updateData.slug = await uniqueProductSlug(prisma, slugify(validatedData.name), product.id)
    }
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.price != null) updateData.price = new Prisma.Decimal(validatedData.price)
    if (validatedData.inventory != null) updateData.inventory = validatedData.inventory
    if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl ?? undefined
    if (validatedData.status != null) updateData.status = validatedData.status
    if (validatedData.ownerId != null) updateData.owner = { connect: { id: validatedData.ownerId } }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: updateData,
      include: {
        owner: true,
      },
    })

    return NextResponse.json(serializeProduct(updatedProduct))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiErrorResponse('Validation failed', 400, error.errors)
    }
    console.error('Error updating product:', error)
    return apiErrorResponse('Failed to update product', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idOrSlug } = await params
    const product = await resolveProduct(idOrSlug)
    if (!product) {
      return apiErrorResponse('Product not found', 404)
    }

    await prisma.product.delete({
      where: { id: product.id },
    })

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting product:', error)
    return apiErrorResponse('Failed to delete product', 500)
  }
}
