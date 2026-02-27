'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PRODUCT_STATUSES, PRODUCT_STATUS_LABELS } from '@/lib/constants'
import { useOwners } from '@/hooks/use-owners'
import { priceToNumber } from '@/lib/currency'
import type { ProductWithOwner } from '@/lib/products'
import { productFormSchema, type ProductFormValues } from '@/lib/product-validation'

interface ProductFormProps {
  product?: ProductWithOwner | null
  isEditing?: boolean
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const { owners, loading: ownersLoading } = useOwners()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sku: product?.sku || '',
      name: product?.name || '',
      description: product?.description || '',
      price: priceToNumber(product?.price),
      inventory: product?.inventory || 0,
      imageUrl: product?.imageUrl || '',
      status: product?.status || 'ACTIVE',
      ownerId: product?.ownerId || 0,
    },
  })

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true)
    form.clearErrors()
    try {
      const url = isEditing ? `/api/products/${product?.slug}` : '/api/products'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json().catch(() => ({ error: 'Failed to save product' }))
      const errorMessage = typeof data?.error === 'string' ? data.error : 'Failed to save product'

      if (!response.ok) {
        if (errorMessage.includes('SKU already exists')) {
          form.setError('sku', { type: 'manual', message: errorMessage })
        } else if (errorMessage.includes('Product owner not found')) {
          form.setError('ownerId', { type: 'manual', message: errorMessage })
        } else if (data?.details && Array.isArray(data.details)) {
          data.details.forEach((err: { path?: string[]; message?: string }) => {
            const field = err.path?.[0]
            if (field && field in values) {
              form.setError(field as keyof ProductFormValues, { type: 'manual', message: err.message ?? errorMessage })
            }
          })
        } else {
          form.setError('root', { type: 'manual', message: errorMessage })
        }
        toast.error(errorMessage)
        setIsSubmitting(false)
        return
      }

      const result = data
      toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully')
      router.push(`/products/${result.slug}`)
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save product'
      form.setError('root', { type: 'manual', message })
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/products" className="inline-block">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      <Card className="p-6 border-border">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          {isEditing ? 'Edit Product' : 'Create New Product'}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {form.formState.errors.root && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {form.formState.errors.root.message}
              </div>
            )}
            {imagePreview && (
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Image Preview
                </label>
                <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden border-2 border-border">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PROD-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wireless Headphones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-7"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inventory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory Count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e)
                        setImagePreview(e.target.value || null)
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Paste a URL to an image from the web
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Owner</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      value={field.value && field.value > 0 ? field.value.toString() : undefined}
                      disabled={ownersLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-1/3">
                          <SelectValue placeholder={ownersLoading ? 'Loading owners…' : 'Select the owner'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {owners.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id.toString()}>
                            {owner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {PRODUCT_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-border">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Product'
                    : 'Create Product'}
              </Button>
              <Link href="/products">
                <Button type="button" variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}
