'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ItemSchema, ItemInput } from '@/features/items/schemas'
import { createItemAction } from '@/features/items/actions'
import { CATEGORIES, CONDITIONS } from '@/lib/constants'
import { Box, Heading, Text, Input, Textarea, Stack, Field, NativeSelect, SimpleGrid } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageContainer } from '@/components/ui/PageContainer'
import { LocationSelector } from '@/components/items/LocationSelector'
import { ImageUploader } from '@/components/items/ImageUploader'
import { useForm, SubmitHandler } from 'react-hook-form'

export const NewItemForm = () => {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(ItemSchema),
  defaultValues: {
    condition: 'good' as const,
    images: [] as string[],
  }
})

  const handleUpload = async (files: File[]) => {
    setUploading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.url) {
          setImages(prev => {
            const updated = [...prev, data.url]
            setValue('images', updated)
            return updated
          })
        }
      } catch (err) {
        console.error('Error subiendo imagen:', err)
      }
    }
    setUploading(false)
  }

  const handleRemove = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index)
      setValue('images', updated)
      return updated
    })
  }

  const onSubmit: SubmitHandler<ItemInput> = async (data) => {
    setServerError(null)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v))
      } else if (value !== undefined) {
        formData.append(key, String(value))
      }
    })
    const result = await createItemAction(null, formData)
    if (result?.error && typeof result.error === 'string') {
      setServerError(result.error)
    }
  }

  const inputStyles = {
    borderColor: 'neutral.500',
    borderRadius: 'lg',
    h: '44px',
    px: '3',
    _focus: { borderColor: 'brand.default', boxShadow: 'none' },
    _placeholder: { color: 'neutral.400' },
  }

  return (
    <PageContainer maxW="2xl" pb={24}>
      <Box mb="6">
        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="neutral.900" mb="1">
          Publicar articulo
        </Heading>
        <Text color="neutral.400" fontSize="sm">
          Completá los datos para poner tu objeto a la venta
        </Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card p="6">
          <Stack gap="5">

            {/* Título */}
            <Field.Root invalid={!!errors.title}>
              <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Título</Field.Label>
              <Input {...register('title')} placeholder="Ej: iPhone 13 Pro 256GB" {...inputStyles} />
              {errors.title && <Field.ErrorText fontSize="xs">{errors.title.message}</Field.ErrorText>}
            </Field.Root>

            {/* Descripción */}
            <Field.Root invalid={!!errors.description}>
              <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Descripción</Field.Label>
              <Textarea
                {...register('description')}
                rows={4}
                placeholder="Describí el objeto, su estado, qué incluye..."
                borderColor="neutral.500"
                borderRadius="lg"
                px="3"
                _focus={{ borderColor: 'brand.default', boxShadow: 'none' }}
                _placeholder={{ color: 'neutral.400' }}
              />
              {errors.description && <Field.ErrorText fontSize="xs">{errors.description.message}</Field.ErrorText>}
            </Field.Root>

            {/* Categoría + Condición */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <Field.Root invalid={!!errors.category}>
                <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Categoría</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register('category')} {...inputStyles}>
                    <option value="">Elegí una...</option>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
                {errors.category && <Field.ErrorText fontSize="xs">{errors.category.message}</Field.ErrorText>}
              </Field.Root>

              <Field.Root invalid={!!errors.condition}>
                <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Estado del objeto</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register('condition')} {...inputStyles}>
                    {CONDITIONS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>
            </SimpleGrid>

            {/* Precio + Tipo */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <Field.Root invalid={!!errors.sale_price}>
                <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Precio ($)</Field.Label>
                <Input {...register('sale_price')} type="number" min="1" placeholder="Ej: 50000" {...inputStyles} />
                {errors.sale_price && <Field.ErrorText fontSize="xs">{errors.sale_price.message}</Field.ErrorText>}
              </Field.Root>

              
            </SimpleGrid>

            {/* Ubicación */}
            <LocationSelector
              errors={errors}
              register={register}
              setValue={setValue}
            />

            {/* Imágenes */}
            <ImageUploader
              images={images}
              uploading={uploading}
              onUpload={handleUpload}
              onRemove={handleRemove}
              error={errors.images?.message}
            />

            {serverError && (
              <Text fontSize="xs" color="feedback.error" textAlign="center">{serverError}</Text>
            )}

            <Button type="submit" py={1} width="full" borderRadius="full" loading={isSubmitting}>
              Publicar 
            </Button>

          </Stack>
        </Card>
      </form>
    </PageContainer>
  )
}