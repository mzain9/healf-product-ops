import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/product-form'
import { getProduct } from '@/lib/products'
import { serializeProduct } from '@/lib/product-serializer'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const { id: idOrSlug } = await params
  const product = await getProduct(idOrSlug)
  if (!product) return { title: 'Product not found' }
  return {
    title: `Edit ${product.name}`,
    description: `Edit product details for ${product.name}`,
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id: idOrSlug } = await params
  const product = await getProduct(idOrSlug)
  if (!product) notFound()

  return <ProductForm product={serializeProduct(product)} isEditing /> 
}
