'use client'

import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { EmblaSlider } from '@/components/ui/EmblaSlider'
import NextLink from 'next/link'
import Image from 'next/image'

interface HeroSlide {
  image: string
  title: string
  buttonLabel: string
  buttonHref: string
  bg: string
  buttonVariant?: 'primary' | 'secondary' | 'ghost' | 'amber' | 'blue'
}

interface HeroProps {
  isLoggedIn: boolean
}
const getSlides = (isLoggedIn: boolean): HeroSlide[] => [
    {
    image: '/hero/girl-in-pool.webp',
    title: 'Compra y venta de artículos de segunda mano.',
    buttonLabel: 'Vender Ahora',
    buttonHref: isLoggedIn ? '/item/new' : '/login',
    bg: 'brand.100',
    buttonVariant: 'primary', 
  },
  {
  image: '/hero/happy-couple.webp',
  title: 'Encontrá lo que buscás al mejor precio.',
  buttonLabel: 'Explorar',
  buttonHref: '/explore',
  bg: 'secondary.50',
  buttonVariant: 'amber',
},
{
  image: '/hero/handshake.webp',
  title: '¡Es rápido, fácil y gratis!',
  buttonLabel: 'Comenzar a Vender',
  buttonHref: isLoggedIn ? '/item/new' : '/login',
  bg: 'accent.50',
  buttonVariant: 'blue',
},
]

const HeroSlideContent = ({ slide }: { slide: HeroSlide }) => (
  <>
    {/* Mobile */}
    <Box display={{ base: 'block', md: 'none' }}>
      <Box position="relative" w="100%" h="55vw" maxH="400px">
  <Image src={slide.image} alt={slide.title} fill style={{ objectFit: 'cover' }} priority />
</Box>
      <Box bg={slide.bg} px={4} py={5}>
        <Heading fontSize="xl" fontWeight="bold" color="neutral.900" mb={6}>{slide.title}</Heading>
        <Button py={1.5} px={8}  asChild><NextLink href={slide.buttonHref}>{slide.buttonLabel}</NextLink></Button>
      </Box>
    </Box>

    {/* Desktop */}
    <Flex display={{ base: 'none', md: 'flex' }} h="320px" bg={slide.bg}>
      <Flex flex={1} direction="column" justify="center" pl="12%" pr={8}>
        <Heading fontSize="xl" 
        maxW={{ base: "100%", md: "80%" }}
        fontWeight="bold" color="neutral.900" mb={4}>{slide.title}</Heading>
       <Button asChild w="fit-content" py={1} px={4} fontSize="sm" borderRadius="full">
  <NextLink href={slide.buttonHref}>{slide.buttonLabel}</NextLink>
</Button>
      </Flex>
      <Box position="relative" w="50%" h="100%" flexShrink={0}>
  <Image src={slide.image} alt={slide.title} fill style={{ objectFit: 'cover' }} priority />
</Box>
    </Flex>
  </>
)

export const Hero = ({ isLoggedIn }: HeroProps) => {
  const slides = getSlides(isLoggedIn)
  return <EmblaSlider slides={slides.map((slide, i) => <HeroSlideContent key={i} slide={slide} />)} />
}