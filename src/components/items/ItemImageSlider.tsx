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
  <img
    src={images[active]}
    alt={title}
    style={{
      width: '100%',
      height: '268px',
      objectFit: 'cover',
      borderRadius: '24px',
      display: 'block',
      paddingLeft: '10px',
      paddingRight: '10px',
      margin: '0 auto',
    }}
  />

  {images.length > 1 && (
    <Flex gap={2} mt={3} px={{ base: 4, md: 3 }} overflowX="auto">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`${title} ${i + 1}`}
          onClick={() => setActive(i)}
          style={{
            width: '56px',
            height: '56px',
            objectFit: 'cover',
            borderRadius: '6px',
            flexShrink: 0,
            cursor: 'pointer',
            opacity: active === i ? 1 : 0.45,
            border: `2px solid ${active === i ? 'var(--chakra-colors-brand-default)' : 'transparent'}`,
            transition: 'opacity 0.2s',
          }}
        />
      ))}
    </Flex>
  )}
</Box>
  )
}