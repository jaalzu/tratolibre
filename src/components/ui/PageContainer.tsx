import { Box } from '@chakra-ui/react'

export function PageContainer({ children, ...props }: any) {
  return (
    <Box maxW="1380px" mx="auto" px={4} py={10} {...props}>
      {children}
    </Box>
  )
}