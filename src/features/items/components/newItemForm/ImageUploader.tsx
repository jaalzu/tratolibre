"use client";

import { useRef } from "react";
import { Box, Flex, Text, Grid } from "@chakra-ui/react";
import Image from "next/image";

const MAX_IMAGES = 4;
const MAX_MB = 2;
const MAX_BYTES = MAX_MB * 1024 * 1024;

interface ImageUploaderProps {
  images: string[];
  uploading: boolean;
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
  error?: string;
}

export const ImageUploader = ({
  images,
  uploading,
  onUpload,
  onRemove,
  error,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.size <= MAX_BYTES);
    const available = MAX_IMAGES - images.length;
    onUpload(valid.slice(0, available));
    e.target.value = "";
  };

  return (
    <Flex direction="column" gap={3}>
      <Flex justify="space-between" align="center">
        <Text fontSize="xs" fontWeight="medium" color="neutral.700">
          Fotos{" "}
          <Text as="span" color="neutral.400">
            ({images.length}/{MAX_IMAGES})
          </Text>
        </Text>
        <Text fontSize="xs" color="red.500">
          Máximo {MAX_MB}MB por foto
        </Text>
      </Flex>

      <Grid templateColumns="repeat(4, 1fr)" gap={2} width="full">
        {images.map((url, i) => (
          <Box
            key={url + i} // Mejor usar el url + index
            position="relative"
            aspectRatio="1"
            borderRadius="lg"
            overflow="hidden"
            width="full" // <--- ASEGURA QUE OCUPE TODA LA CELDA
            bg="neutral.100" // Un fondito por si la imagen tarda en cargar
          >
            <Image
              src={url}
              alt={`foto-${i}`}
              fill
              sizes="(max-width: 768px) 25vw, 150px"
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />

            {/* Botón eliminar */}
            <Box
              position="absolute"
              top="4px"
              right="4px"
              w="24px"
              h="24px"
              borderRadius="full"
              bg="blackAlpha.700"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              color="white"
              zIndex={2}
              _hover={{ bg: "black" }}
              onClick={() => onRemove(i)}
            >
              ×
            </Box>

            {i === 0 && (
              <Box
                position="absolute"
                bottom="0"
                width="full"
                py={1}
                bg="blackAlpha.600"
                textAlign="center"
              >
                <Text
                  fontSize="10px"
                  color="white"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Portada
                </Text>
              </Box>
            )}
          </Box>
        ))}

        {/* Box para agregar (Solo si falta para llegar al máximo) */}
        {images.length < MAX_IMAGES && (
          <Box
            aspectRatio="1"
            width="full" // <--- PARA QUE SEA IGUAL A LAS OTRAS
            borderRadius="lg"
            border="2px dashed"
            borderColor={uploading ? "brand.500" : "neutral.300"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            cursor={uploading ? "not-allowed" : "pointer"}
            onClick={() => !uploading && inputRef.current?.click()}
            _hover={
              !uploading ? { borderColor: "brand.500", bg: "gray.50" } : {}
            }
            transition="all 0.2s"
          >
            {uploading ? (
              <Text
                fontSize="2xs"
                color="brand.500"
                fontWeight="bold"
                textAlign="center"
              >
                Subiendo...
              </Text>
            ) : (
              <>
                <Text fontSize="2xl" color="neutral.400" mb={-1}>
                  +
                </Text>
                <Text fontSize="10px" color="neutral.400" fontWeight="medium">
                  FOTO
                </Text>
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
        style={{ display: "none" }}
      />

      {error && (
        <Text fontSize="xs" color="red.500">
          {error}
        </Text>
      )}
    </Flex>
  );
};
