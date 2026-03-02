'use client'

import { Box, Text } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { EditProfileFields } from './EditProfileFields'
import { useEditProfile } from '@/features/profile/useEditProfile'

interface EditProfileFormProps {
  defaultValues: {
    name?: string | null
    location?: string | null
  }
}

export const EditProfileForm = ({ defaultValues }: EditProfileFormProps) => {
  const { handleSubmit, isPending } = useEditProfile()

  return (
    <form onSubmit={handleSubmit}>
    <EditProfileFields defaultValues={defaultValues} />
    {isPending && <Text fontSize="xs" color="neutral.400" mt={2}>Guardando...</Text>}
    <Button type="submit" w="full" borderRadius="full" mt={6} loading={isPending}>
      Guardar cambios
    </Button>
  </form>
  )
}