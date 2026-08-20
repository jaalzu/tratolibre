"use client";

import { toaster } from "@/shared/components/ui/toaster";
import { useRef } from "react";
import { Box, Flex, Text, Grid, Spinner, Stack, chakra } from "@chakra-ui/react";
import Image from "next/image";

const MAX_IMAGES = 4;
const MAX_MB = 20;
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

  const processFiles = (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    const tooLarge = files.some((f) => f.size > MAX_BYTES);

    if (tooLarge) {
      toaster.create({
        title: "Imagen muy pesada",
        description: `El límite es de ${MAX_MB}MB por foto.`,
        type: "error",
      });
    }

    if (images.length + files.length > MAX_IMAGES) {
      toaster.create({
        title: "Límite alcanzado",
        description: `Solo podés subir hasta ${MAX_IMAGES} fotos.`,
        type: "warning",
      });
    }

    const valid = files.filter((f) => f.size <= MAX_BYTES);
    const available = MAX_IMAGES - images.length;
    if (valid.length > 0) {
      onUpload(valid.slice(0, available));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <Flex direction="column" gap={3}>
      <Flex justify="space-between" align="center" minH="20px">
        <Text fontSize="xs" fontWeight="medium" color="neutral.700">
          Fotos{" "}
          <Text as="span" color="neutral.400">
            ({images.length}/{MAX_IMAGES})
          </Text>
        </Text>

        {/* TEXTO NUEVO: ARRIBA, DERECHA Y ROJO */}
        {uploading && (
          <Text fontSize="xs" color="red.500" fontWeight="bold">
            Esto puede tardar unos segundos
          </Text>
        )}
      </Flex>

      <Grid templateColumns="repeat(4, 1fr)" gap={2} width="full">
        {images.map((url, i) => (
          <Box
            key={url + i}
            position="relative"
            aspectRatio="1"
            borderRadius="lg"
            overflow="hidden"
            width="full"
            bg="neutral.100"
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="(max-width: 768px) 25vw, 150px"
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />
            <chakra.button
              type="button"
              aria-label={`Eliminar foto ${i + 1}`}
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
              border="none"
              p="0"
              _hover={{ bg: "black" }}
              onClick={() => onRemove(i)}
            >
              ×
            </chakra.button>
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

        {images.length < MAX_IMAGES && (
          <chakra.button
            type="button"
            disabled={uploading}
            aria-label="Agregar foto o arrastrar aquí"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!uploading) inputRef.current?.click();
              }
            }}
            aspectRatio="1"
            width="full"
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
            p={1}
            bg="transparent"
          >
            {uploading ? (
              <Stack align="center" gap={1}>
                <Spinner size="xs" color="brand.500" />
                <Text
                  fontSize="9px"
                  color="brand.500"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Subiendo fotografía...
                </Text>
              </Stack>
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
          </chakra.button>
        )}
      </Grid>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
        multiple
        onChange={handleChange}
        aria-label="Subir fotos del artículo"
        hidden
      />
      {error && (
        <Text fontSize="xs" color="red.500">
          {error}
        </Text>
      )}
    </Flex>
  );
};
