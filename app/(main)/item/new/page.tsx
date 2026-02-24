'use client'

import { useActionState, useState } from 'react'
import { createItemAction } from '@/features/items/actions'
import { CATEGORIES, CONDITIONS } from '@/features/items/utils'
import { 
  chakra,
  Box, 
  Flex, 
  Heading, 
  Text, 
  Input, 
  Textarea, 
  Stack, 
  SimpleGrid, 
  Image, 
  Field,
  NativeSelect
} from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function NewItemPage() {
  const [state, formAction] = useActionState<any, FormData>(createItemAction, null)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.url) setImages(prev => [...prev, data.url])
      } catch (err) {
        console.error("Error subiendo imagen:", err)
      }
    }
    setUploading(false)
  }

  // Estilo base para inputs de tu sistema
  const inputStyles = {
    borderColor: "neutral.100",
    bg: "white",
    fontSize: "sm",
    borderRadius: "md",
    _focus: { 
      borderColor: "brand.default", 
      boxShadow: "focus" 
    }
  }

  return (
    <PageContainer maxW="2xl" py="12">
      <Box mb="8">
        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="neutral.900" mb="1">
          Publicar objeto
        </Heading>
        <Text color="neutral.400" fontSize="sm">
          Completá los datos para poner tu objeto a la venta
        </Text>
      </Box>

      <form action={formAction}>
        <Card p="6">
          <Stack gap="6">
            
            {/* Título */}
            <Field.Root invalid={!!state?.error?.fieldErrors?.title}>
              <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">Título</Field.Label>
              <Input name="title" placeholder="Ej: iPhone 13 Pro 256GB" {...inputStyles} />
              {state?.error?.fieldErrors?.title && (
                <Field.ErrorText color="feedback.error" fontSize="xs">
                  {state.error.fieldErrors.title[0]}
                </Field.ErrorText>
              )}
            </Field.Root>

            {/* Descripción */}
            <Field.Root invalid={!!state?.error?.fieldErrors?.description}>
              <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">Descripción</Field.Label>
              <Textarea 
                name="description" 
                rows={4} 
                placeholder="Describí el objeto, su estado, qué incluye..." 
                {...inputStyles} 
              />
              {state?.error?.fieldErrors?.description && (
                <Field.ErrorText color="feedback.error" fontSize="xs">
                  {state.error.fieldErrors.description[0]}
                </Field.ErrorText>
              )}
            </Field.Root>

            <SimpleGrid columns={2} gap="4">
              {/* Categoría */}
              <Field.Root invalid={!!state?.error?.fieldErrors?.category}>
                <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">Categoría</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field name="category" {...inputStyles}>
                    <option value="">Elegí una...</option>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>

              {/* Estado */}
              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">Estado del objeto</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field name="condition" {...inputStyles}>
                    {CONDITIONS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>
            </SimpleGrid>

            {/* Precio de Venta */}
            <Field.Root invalid={!!state?.error?.fieldErrors?.sale_price}>
              <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">Precio de venta ($)</Field.Label>
              <Input name="sale_price" type="number" min="0" placeholder="0" {...inputStyles} />
              {state?.error?.fieldErrors?.sale_price && (
                <Field.ErrorText color="feedback.error" fontSize="xs">
                  {state.error.fieldErrors.sale_price[0]}
                </Field.ErrorText>
              )}
            </Field.Root>

            {/* Ubicación */}
            <SimpleGrid columns={2} gap="4">
              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">Barrio / Zona</Field.Label>
                <Input name="location" placeholder="Ej: Palermo" {...inputStyles} />
              </Field.Root>
              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">Ciudad</Field.Label>
                <Input name="city" placeholder="Ej: Buenos Aires" {...inputStyles} />
              </Field.Root>
            </SimpleGrid>

            {/* Fotos con chakra.input corregido */}
            <Field.Root invalid={!!state?.error?.fieldErrors?.images}>
              <Field.Label fontSize="sm" fontWeight="bold" color="neutral.700">Fotos</Field.Label>
              
              <chakra.input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload}
                display="block"
                w="full"
                fontSize="sm"
                color="neutral.400"
                cursor="pointer"
                _file={{
                  mr: "4",
                  py: "2",
                  px: "4",
                  borderRadius: "md",
                  border: "0",
                  fontSize: "xs",
                  fontWeight: "bold",
                  bg: "brand.default",
                  color: "white",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  _hover: { bg: "brand.hover" }
                }}
              />

              {uploading && (
                <Text fontSize="xs" color="brand.default" mt="2" fontWeight="bold">
                  Subiendo fotos...
                </Text>
              )}
              
              {images.length > 0 && (
                <Flex gap="2" mt="3" flexWrap="wrap">
                  {images.map((url, i) => (
                    <Image 
                      key={i} 
                      src={url} 
                      w="20" 
                      h="20" 
                      objectFit="cover" 
                      borderRadius="md" 
                      border="1px solid"
                      borderColor="neutral.100"
                      alt={`Preview ${i}`}
                    />
                  ))}
                </Flex>
              )}

              {/* Inputs ocultos para el Server Action */}
              {images.map(url => (
                <input key={url} type="hidden" name="images" value={url} />
              ))}
              
              {state?.error?.fieldErrors?.images && (
                <Field.ErrorText color="feedback.error" fontSize="xs">
                  {state.error.fieldErrors.images[0]}
                </Field.ErrorText>
              )}
            </Field.Root>

            {/* Error General */}
            {state?.error && typeof state.error === 'string' && (
              <Text color="feedback.error" fontSize="sm" textAlign="center" fontWeight="bold">
                {state.error}
              </Text>
            )}

            <Button type="submit" width="full" py="6" fontSize="md">
              Publicar objeto
            </Button>

          </Stack>
        </Card>
      </form>
    </PageContainer>
  )
}