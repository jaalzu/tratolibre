import { Box } from '@chakra-ui/react'
import { NewItemForm } from '@/features/items/components/newItemForm/NewItemForm'

export default function NewItemPage() {
  return (
    <Box bg="neutral.150" minH="100vh">
      <NewItemForm />
    </Box>
  )
}