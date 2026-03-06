import Image from 'next/image'
import { Box, Grid } from '@chakra-ui/react'

const photos = [
  '/hero/girl-in-pool.webp',
  '/hero/happy-couple.webp',
  '/hero/handshake.webp',
  '/hero/girl-in-pool.webp',
  '/hero/happy-couple.webp',
]

const accents = [
  'brand.default',
  'secondary.default',
  'accent.default',
  'brand.default',
  'secondary.default',
]

const areas = [
  { colSpan: 2, rowSpan: 2, h: '100px' },
  { colSpan: 1, rowSpan: 1, h: '45px' },
  { colSpan: 1, rowSpan: 2, h: '100px' },
  { colSpan: 1, rowSpan: 1, h: '45px' },
  { colSpan: 1, rowSpan: 1, h: '45px' },
]

export const RegisterCollage = () => (
  <Grid
    templateColumns="repeat(3, 1fr)"
    templateRows="repeat(2, auto)"
    gap={3}
    w="100%"
  >
    {photos.map((src, i) => (
      <Box
        key={i}
        gridColumn={`span ${areas[i].colSpan}`}
        gridRow={`span ${areas[i].rowSpan}`}
        position="relative"
      >
        {/* Offset shadow */}
        <Box
          position="absolute"
          bottom="-5px"
          right="-5px"
          w="100%"
          h="100%"
          borderRadius="xl"
          bg={accents[i]}
          zIndex={0}
        />
        {/* Photo */}
        <Box position="relative" w="100%" h={areas[i].h} borderRadius="xl" overflow="hidden" zIndex={1}>
          <Image src={src} alt={`photo-${i}`} fill style={{ objectFit: 'cover' }} />
        </Box>
      </Box>
    ))}
  </Grid>
)