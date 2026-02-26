'use client'

import { useRef } from 'react'
import { Box, Flex, Text, Grid } from '@chakra-ui/react'
import Image from 'next/image'

const MAX_IMAGES = 4
const MAX_MB = 5
const MAX_BYTES = MAX_MB * 1024 * 1024

interface ImageUploaderProps {
  images: string[]
  uploading: boolean
  onUpload: (files: File[]) => void
  onRemove: (index: number) => void
  error?: string
}

export const ImageUploader = ({ images, uploading, onUpload, onRemove, error }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const valid = files.filter(f => {
      if (f.size > MAX_BYTES) return false
      return true
    })
    const available = MAX_IMAGES - images.length
    onUpload(valid.slice(0, available))
    e.target.value = ''
  }

  return (
    <Flex direction="column" gap={3}>
      <Flex justify="space-between" align="center">
        <Text fontSize="xs" fontWeight="medium" color="neutral.700">
          Fotos <Text as="span" color="neutral.400">({images.length}/{MAX_IMAGES})</Text>
        </Text>
        <Text fontSize="xs" color="neutral.400">Máx {MAX_MB}MB por foto</Text>
      </Flex>

      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {images.map((url, i) => (
          <Box key={i} position="relative" aspectRatio="1" borderRadius="lg" overflow="hidden">
            <Image src={url} alt={`foto-${i}`} fill style={{ objectFit: 'cover' }} />
            <Box
              position="absolute"
              top="4px"
              right="4px"
              w="20px"
              h="20px"
              borderRadius="full"
              bg="blackAlpha.700"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              fontSize="xs"
              color="white"
              fontWeight="bold"
              onClick={() => onRemove(i)}
            >
              ×
            </Box>
            {i === 0 && (
              <Box
                position="absolute"
                bottom="4px"
                left="4px"
                px={1.5}
                py={0.5}
                bg="blackAlpha.700"
                borderRadius="sm"
              >
                <Text fontSize="2xs" color="white" fontWeight="bold">Principal</Text>
              </Box>
            )}
          </Box>
        ))}

        {images.length < MAX_IMAGES && (
          <Box
            aspectRatio="1"
            borderRadius="lg"
            border="2px dashed"
            borderColor={uploading ? 'brand.default' : 'neutral.300'}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            cursor={uploading ? 'not-allowed' : 'pointer'}
            onClick={() => !uploading && inputRef.current?.click()}
            transition="all 0.2s"
            _hover={{ borderColor: 'brand.default', bg: 'brand.50' }}
            gap={1}
          >
            {uploading ? (
              <Text fontSize="xs" color="brand.default" fontWeight="bold">Subiendo...</Text>
            ) : (
              <>
                <Text fontSize="xl" lineHeight={1}>+</Text>
                <Text fontSize="2xs" color="neutral.400" textAlign="center">Agregar foto</Text>
              </>
            )}
          </Box>
        )}
      </Grid>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {error && <Text fontSize="xs" color="feedback.error">{error}</Text>}
    </Flex>
  )
}