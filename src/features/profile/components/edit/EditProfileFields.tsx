import { Stack, Field, Input } from '@chakra-ui/react'

interface EditProfileFieldsProps {
  defaultValues: {
    name?: string | null
    location?: string | null
  }
}

export const EditProfileFields = ({ defaultValues }: EditProfileFieldsProps) => (
  <Stack gap={4}>
    <Field.Root>
      <Field.Label fontSize="sm" fontWeight="medium">Nombre</Field.Label>
      <Input name="name" defaultValue={defaultValues.name ?? ''} borderRadius="xl" _focus={{ borderColor: 'brand.default', boxShadow: 'none' }} />
    </Field.Root>
    <Field.Root>
      <Field.Label fontSize="sm" fontWeight="medium">Ubicación</Field.Label>
      <Input name="location" defaultValue={defaultValues.location ?? ''} placeholder="Ej: Buenos Aires" borderRadius="xl" _focus={{ borderColor: 'brand.default', boxShadow: 'none' }} />
    </Field.Root>
  </Stack>
)