'use client'

import { Stack, SimpleGrid, Input, Textarea, Text } from '@chakra-ui/react'
import { useController } from 'react-hook-form'
import { CATEGORIES, CONDITIONS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageContainer } from '@/components/ui/PageContainer'
import { LocationSelector } from './LocationSelector'
import { ImageUploader } from './ImageUploader'
import { useNewItemForm } from '@/features/items/hooks/useNewItemForm'
import { FormField, FormHeader, inputStyles } from './FormFields'
import { FormSelect } from './FormSelect'
import { Item } from '@/features/items/types'

export const NewItemForm = ({ initialData }: { initialData?: Partial<Item> }) => {
  const {
    register, handleSubmit, onSubmit, errors, isSubmitting,
    images, uploading, serverError, handleUpload, handleRemove, setValue, control
  } = useNewItemForm(initialData)

  const { field: categoryField }  = useController({ name: 'category',  control })
  const { field: conditionField } = useController({ name: 'condition', control })

  return (
    <PageContainer maxW="4xl" pb={{ base: 24, lg: 10 }} pt={3}>
      <FormHeader isEditing={!!initialData} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card p="6">
          <Stack gap="4">

            <FormField label="Título" error={errors.title}>
              <Input {...register('title')} placeholder="Ej: iPhone 11" {...inputStyles} />
            </FormField>

            <FormField label="Descripción" error={errors.description}>
              <Textarea
                {...register('description')}
                rows={3}
                p={2}
                placeholder="Detalles del producto..."
                {...inputStyles}
                h="auto"
              />
            </FormField>

            {/* Categoría + Estado + Precio en una fila */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} gap="3">
              <FormField label="Categoría" error={errors.category}>
                <FormSelect
                  value={categoryField.value ?? ''}
                  onChange={categoryField.onChange}
                  options={CATEGORIES.map(c => ({ id: c.id, label: `${c.icon} ${c.label}` }))}
                  placeholder="Elegí una..."
                  invalid={!!errors.category}
                />
              </FormField>

              <FormField label="Estado" error={errors.condition}>
                <FormSelect
                  value={conditionField.value ?? ''}
                  onChange={conditionField.onChange}
                  options={CONDITIONS.map(c => ({ id: c.id, label: c.label }))}
                  placeholder="Estado..."
                  invalid={!!errors.condition}
                />
              </FormField>

              <FormField label="Precio ($)" error={errors.sale_price}>
                <Input {...register('sale_price')} type="number" {...inputStyles} />
              </FormField>
            </SimpleGrid>

            <LocationSelector errors={errors} register={register} setValue={setValue} />

            <ImageUploader
              images={images}
              uploading={uploading}
              onUpload={handleUpload}
              onRemove={handleRemove}
              error={errors.images?.message}
            />

            {serverError && (
              <Text fontSize="xs" color="red.500" textAlign="center" fontWeight="bold">
                {serverError}
              </Text>
            )}

            <Button
              type="submit"
              py={1.5}
              width="full"
              borderRadius="full"
              loading={isSubmitting}
            >
              {initialData ? 'Guardar cambios' : 'Publicar ahora'}
            </Button>

          </Stack>
        </Card>
      </form>
    </PageContainer>
  )
}