'use client'

import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'

export default function ItemImageSlider({ images, title }: { images: string[], title: string }) {
  const [active, setActive] = useState(0)

  if (!images?.length) return (
    <Box w="100%" h={{ base: "268px", md: "420px" }} bg="neutral.100" borderRadius="xl" mx="auto" />
  )

  return (
    <Box>
      <Box
        as="img"
        src={images[active]}
        alt={title}
        w="100%"
        h={{ base: "268px", md: "480px" }}
        objectFit="cover"
        borderRadius="xl"
        display="block"
        mx="auto"
      />

      {images.length > 1 && (
        <Flex gap={2} mt={2} px={{ base: 4, md: 0 }} overflowX="auto">
          {images.map((url, i) => (
            <Box
              key={i}
              as="img"
              src={url}
              alt={`${title} ${i + 1}`}
              w="56px"
              h="56px"
              objectFit="cover"
              borderRadius="md"
              flexShrink={0}
              cursor="pointer"
              opacity={active === i ? 1 : 0.45}
              border="2px solid"
              borderColor={active === i ? "brand.default" : "transparent"}
              onClick={() => setActive(i)}
              transition="opacity 0.2s"
            />
          ))}
        </Flex>
      )}
    </Box>
  )
}