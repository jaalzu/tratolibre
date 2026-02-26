import { Box, Flex, Text, IconButton, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { logoutAction } from '@/features/auth/actions'
import 'boxicons/css/boxicons.min.css'
import { CATEGORIES } from '@/lib/constants'


interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  user: any
}

export const MobileDrawer = ({ open, onClose, user }: MobileDrawerProps) => (
  <>
    <Box
  position="fixed"
  inset={0}
  bg="blackAlpha.400"
  zIndex={100}
  display={open ? 'block' : 'none'}
  onClick={onClose}
/>
    <Box
      position="fixed" top={0} right={0} h="100vh" w="280px"
      bg="neutral.50" boxShadow="xl" zIndex={101}
      transform={open ? 'translateX(0)' : 'translateX(100%)'}
      transition="transform 0.25s ease"
      display="flex" flexDirection="column"
    >
      <Flex align="center" justify="space-between" px={4} py={3} borderBottom="1px solid" borderColor="neutral.100" bg="white">
        <Text fontSize="md" fontWeight="bold" color="neutral.800">Menú</Text>
        <IconButton variant="ghost" size="xs" color="neutral.400" onClick={onClose} _hover={{ bg: "neutral.100", color: "neutral.700" }}>
          <i className='bx bx-x' style={{ fontSize: '20px' }}></i>
        </IconButton>
      </Flex>

      <Box overflowY="auto" flex={1} p={4}>
        <Stack gap={6}>
          {!user && (
            <NextLink href="/login" onClick={onClose}>
              <Flex align="center" gap={3} p={3} bg="brand.default" borderRadius="md" color="white">
                <i className='bx bx-user-circle' style={{ fontSize: '24px' }}></i>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">Bienvenido</Text>
                  <Text fontSize="xs">Iniciá sesión para publicar</Text>
                </Box>
              </Flex>
            </NextLink>
          )}

          <Box>
            <Text fontSize="xs" color="neutral.400" fontWeight="bold" mb={3} letterSpacing="wider">CATEGORÍAS</Text>
            <Stack gap={1}>
            {CATEGORIES.map((cat) => (
  <NextLink key={cat.id} href={`/category/${cat.id}`} onClick={onClose}>
    <Flex align="center" justify="space-between" py={3} px={2} borderRadius="sm" _hover={{ bg: "neutral.100" }}>
      <Text fontSize="sm" color="neutral.700">{cat.label}</Text>
      <i className='bx bx-chevron-right' style={{ color: 'var(--chakra-colors-neutral-300)' }}></i>
    </Flex>
  </NextLink>
))}
            </Stack>
          </Box>

          {user && (
            <form action={logoutAction}>
              <button type="submit" style={{ width: '100%' }}>
                <Flex align="center" gap={3} p={3} color="feedback.error" _hover={{ bg: "red.50" }} borderRadius="md">
                  <i className='bx bx-log-out' style={{ fontSize: '20px' }}></i>
                  <Text fontWeight="bold" fontSize="sm">Cerrar sesión</Text>
                </Flex>
              </button>
            </form>
          )}
        </Stack>
      </Box>
    </Box>
  </>
)