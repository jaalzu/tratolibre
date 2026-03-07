import { Stack, Input } from '@chakra-ui/react'
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form'
import { EditProfileInput } from '@/features/profile/schemas'
import { FormField, inputStyles } from '@/features/items/components/newItemForm/FormFields'
import { FormSelect } from '@/features/items/components/newItemForm/FormSelect'
import { useController } from 'react-hook-form'
import { PROVINCES } from '@/lib/constants'

interface EditProfileFieldsProps {
  register: UseFormRegister<EditProfileInput>
  errors:   FieldErrors<EditProfileInput>
  control:  Control<EditProfileInput>
}

export const EditProfileFields = ({ register, errors, control }: EditProfileFieldsProps) => {
  const { field: provinceField } = useController({ name: 'province', control })

  return (
    <Stack gap={4}>
      <FormField label="Nombre" error={errors.name}>
        <Input {...register('name')} placeholder="Tu nombre" {...inputStyles} />
      </FormField>

      <FormField label="Provincia" error={errors.province}>
        <FormSelect
          value={provinceField.value ?? ''}
          onChange={provinceField.onChange}
          options={PROVINCES.map(p => ({ id: p, label: p }))}
          placeholder="Elegí tu provincia..."
        />
      </FormField>

      <FormField label="Ciudad / Zona" error={errors.location}>
        <Input {...register('location')} placeholder="Ej: Buenos Aires, Palermo..." {...inputStyles} />
      </FormField>
    </Stack>
  )
}