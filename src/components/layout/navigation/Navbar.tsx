'use client'

import { 
  Box, 
  Flex, 
  Text, 
  Input, 
  Group, 
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { logoutAction } from '@/features/auth/actions'
import NavLink from './NavLink' 
import 'boxicons/css/boxicons.min.css'

const CATEGORIES = ['Hogar', 'Tecnología', 'Vehículos', 'Inmuebles', 'Servicios', 'Moda', 'Deportes', 'Mascotas', 'Otros'];

export default function Navbar({ user }: { user: any }) {
  const { open, onOpen, onClose } = useDisclosure() // Menu mobile
  const { open: openCats, onOpen: onOpenCats, onClose: onCloseCats } = useDisclosure() // Sidebar Categorías

  const loggedNavItems = [
    { label: 'Inicio', href: '/', icon: 'bx-home-alt' },
    { label: 'Favoritos', href: '/favorites', icon: 'bx-heart' },
    { label: 'Publicar', href: '/item/new', icon: 'bx-plus-circle' },
    { label: 'Buzón', href: '/messages', icon: 'bx-message-square-dots' },
    { label: 'Perfil', href: '/dashboard', icon: 'bx-user' },
  ];

  return (
    <Box as="nav" position="sticky" top={0} zIndex={50} shadow="base">
      
      {/* 1. NAVBAR PRINCIPAL */}
      <Box bg="brand.default"> 
        <Flex maxW="1280px" mx="auto" px={3} h="60px" align="center" justify="space-between" gap={1}>
          
          <NextLink href="/" passHref>
            <Text fontWeight="bold" fontSize="md" color="neutral.50" whiteSpace="nowrap">TratoLibre</Text>
          </NextLink>

          <Group flex="1" maxW={{ base: "full", md: "600px" }}>
            <Box position="relative" w="full">
              <Box position="absolute" left="3" top="50%" transform="translateY(-40%)" zIndex={10}>
                <i className='bx bx-search' style={{ color: 'var(--chakra-colors-neutral-300)', fontSize: '20px' }}></i>
              </Box>
              <Input 
                placeholder="Buscar..." ps="10" h="32px" fontSize="sm" 
                bg="neutral.50" color="neutral.900" borderRadius="full" border="none"
                _focus={{ shadow: "focus" }}
              />
            </Box>
          </Group>

          <Flex align="center" gap={2} display={{ base: "none", md: "flex" }}>
            {user ? (
              <>
                {loggedNavItems.map((item) => (
                  <NavLink 
                    key={item.label} 
                    href={item.href} 
                    label={item.label} 
                    icon={item.icon} 
                    variant="desktop" 
                  />
                ))}
                <form action={logoutAction}>
                  <IconButton 
                    type="submit" 
                    variant="ghost" 
                    color="neutral.50" 
                    _hover={{ bg: "whiteAlpha.200" }}
                  >
                    <i className='bx bx-log-out' style={{ fontSize: '18px' }}></i>
                  </IconButton>
                </form>
              </>
            ) : (
              <>
                <NextLink href="/login">
                  <Box 
                    border="1px solid" borderColor="neutral.50" color="neutral.50" 
                    px={3} py={1.5} borderRadius="md" fontSize="sm" fontWeight="bold" 
                    _hover={{ bg: "whiteAlpha.200" }} transition="0.2s"
                  >
                    Regístrate o Inicia sesión
                  </Box>
                </NextLink>
                
                <NextLink href="/item/new">
                  <Box 
                    bg="neutral.50" color="brand.default" px={4} py={1.5} 
                    borderRadius="md" fontSize="sm" fontWeight="bold" 
                    _hover={{ bg: "neutral.100" }} shadow="base"
                  >
                    Vender
                  </Box>
                </NextLink>
              </>
            )}
          </Flex>

          <IconButton display={{ base: "flex", md: "none" }} variant="ghost" size="sm" color="neutral.50" onClick={onOpen}>
            <i className='bx bx-category' style={{ fontSize: '28px' }}></i>
          </IconButton>
        </Flex>
      </Box>

      {/* 2. BARRA DE CATEGORÍAS */}
      <Box 
        bg="neutral.50" 
        borderBottom="1px solid" 
        borderColor="neutral.100" 
        display={{ base: "none", md: "block" }}
      >
        <Flex 
          maxW="1280px" 
          mx="auto" 
          px={4}
          h="30px" 
          align="center"
        >
          {/* BOTÓN TODAS LAS CATEGORÍAS */}
          <Flex 
            align="center" 
            cursor="pointer" 
            onClick={onOpenCats} 
            gap={1.5} 
            mr={6}
            color="neutral.500"
            _hover={{ color: "brand.default" }}
            transition="0.2s"
          >
            <i className='bx bx-menu' style={{ fontSize: '15px' }}></i>
            <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">Todas las categorías</Text>
          </Flex>

          {/* CATEGORÍAS PRINCIPALES */}
          <Flex align="center" gap={6}>
            {CATEGORIES.slice(0, 6).map((cat) => (
              <NextLink key={cat} href={`/category/${cat.toLowerCase()}`}>
                <Text 
                  fontSize="xs" 
                  fontWeight="normal" 
                  color="neutral.400" 
                  _hover={{ color: "brand.default" }}
                  whiteSpace="nowrap"
                >
                  {cat}
                </Text>
              </NextLink>
            ))}
          </Flex>
        </Flex>
      </Box>

      {/* 3. SIDEBAR DE CATEGORÍAS - custom, sin Chakra Drawer para evitar layout shift */}
      {/* Backdrop */}
      {openCats && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.400"
          zIndex={100}
          onClick={onCloseCats}
        />
      )}

      {/* Panel */}
      <Box
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w="260px"
        bg="white"
        boxShadow="xl"
        zIndex={101}
        transform={openCats ? 'translateX(0)' : 'translateX(-100%)'}
        transition="transform 0.25s ease"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          px={5}
          py={3}
          borderBottom="1px solid"
          borderColor="neutral.100"
        >
          <Text fontSize="sm" fontWeight="bold" color="neutral.600">Categorías</Text>
          <IconButton
            variant="ghost"
            size="xs"
            color="neutral.400"
            onClick={onCloseCats}
            _hover={{ bg: "neutral.100", color: "neutral.700" }}
          >
            <i className='bx bx-x' style={{ fontSize: '18px' }}></i>
          </IconButton>
        </Flex>

        {/* Lista */}
        <Box overflowY="auto" flex={1} pt={2}>
          {CATEGORIES.map((cat) => (
            <NextLink key={cat} href={`/category/${cat.toLowerCase()}`} onClick={onCloseCats}>
              <Flex
                px={5}
                py={3}
                borderBottom="1px solid"
                borderColor="neutral.50"
                _hover={{ bg: "neutral.50", color: "brand.default" }}
                align="center"
                justify="space-between"
              >
                <Text fontSize="xs" fontWeight="medium" color="neutral.500">{cat}</Text>
                <i className='bx bx-chevron-right' style={{ opacity: 0.25, fontSize: '14px' }}></i>
              </Flex>
            </NextLink>
          ))}
        </Box>
      </Box>

      {/* 4. DRAWER MOBILE - custom, sin Chakra Drawer */}
      {/* Backdrop */}
      {open && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.400"
          zIndex={100}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <Box
        position="fixed"
        top={0}
        right={0}
        h="100vh"
        w="280px"
        bg="neutral.50"
        boxShadow="xl"
        zIndex={101}
        transform={open ? 'translateX(0)' : 'translateX(100%)'}
        transition="transform 0.25s ease"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          px={4}
          py={3}
          borderBottom="1px solid"
          borderColor="neutral.100"
          bg="white"
        >
          <Text fontSize="md" fontWeight="bold" color="neutral.800">Menú</Text>
          <IconButton
            variant="ghost"
            size="xs"
            color="neutral.400"
            onClick={onClose}
            _hover={{ bg: "neutral.100", color: "neutral.700" }}
          >
            <i className='bx bx-x' style={{ fontSize: '20px' }}></i>
          </IconButton>
        </Flex>

        {/* Body */}
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
                  <NextLink key={cat} href={`/category/${cat.toLowerCase()}`} onClick={onClose}>
                    <Flex align="center" justify="space-between" py={3} px={2} borderRadius="sm" _hover={{ bg: "neutral.100" }}>
                      <Text fontSize="sm" color="neutral.700">{cat}</Text>
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
    </Box>
  )
}