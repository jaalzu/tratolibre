import { Box, BoxProps } from '@chakra-ui/react'

interface PageContainerProps extends BoxProps {
  children: React.ReactNode
}

export function PageContainer({ children, ...props }: PageContainerProps) {
  return (
    <Box maxW="1380px" mx="auto" px={4} py={10} {...props}>
      {children}
    </Box>
  )
}