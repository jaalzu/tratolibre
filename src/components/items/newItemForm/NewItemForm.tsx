'use client'

import { Stack, SimpleGrid, Input, Textarea, NativeSelect, Text } from '@chakra-ui/react'
import { CATEGORIES, CONDITIONS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageContainer } from '@/components/ui/PageContainer'

// Componentes del dominio (Location e Image)
import { LocationSelector } from './LocationSelector'
import { ImageUploader } from './ImageUploader'

// Lógica y Componentes UI extraídos
import { useNewItemForm } from '@/features/items/useNewItemForm'
import { FormField, FormHeader, inputStyles } from './FormFields'

export const NewItemForm = () => {
  const { 
    register, handleSubmit, onSubmit, errors, isSubmitting, 
    images, uploading, serverError, handleUpload, handleRemove, setValue 
  } = useNewItemForm()

  return (
    <PageContainer maxW="2xl" pb={24}>
      <FormHeader />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card p="6">
          <Stack gap="5">
            
            <FormField label="Título" error={errors.title}>
              <Input {...register('title')} placeholder="Ej: iPhone 13 Pro" {...inputStyles} />
            </FormField>

            <FormField label="Descripción" error={errors.description}>
              <Textarea 
                {...register('description')} 
                rows={4} 
                placeholder="Detalles del producto..." 
                {...inputStyles} 
                h="auto"
              />
            </FormField>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <FormField label="Categoría" error={errors.category}>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register('category')} {...inputStyles}>
                    <option value="">Elegí una...</option>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </FormField>

              <FormField label="Estado del objeto" error={errors.condition}>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register('condition')} {...inputStyles}>
                    {CONDITIONS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </FormField>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <FormField label="Precio ($)" error={errors.sale_price}>
                <Input {...register('sale_price')} type="number" {...inputStyles} />
              </FormField>
            </SimpleGrid>

            {/* Componentes separados que manejan su propio registro al form */}
            <LocationSelector errors={errors} register={register} setValue={setValue} />

            <ImageUploader
              images={images}
              uploading={uploading}
              onUpload={handleUpload}
              onRemove={handleRemove}
              error={errors.images?.message}
            />

            {/* Error del Server Action */}
            {serverError && (
              <Text fontSize="xs" color="red.500" textAlign="center" fontWeight="bold">
                {serverError}
              </Text>
            )}

            <Button 
              type="submit" 
              py={1} 
              width="full" 
              borderRadius="full" 
              loading={isSubmitting}
              colorScheme="brand"
            >
              Publicar ahora
            </Button>

          </Stack>
        </Card>
      </form>
    </PageContainer>
  )
}