"use client";

import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useImageSlider } from "../../hooks/useImageSlider";
import { ChevronsLeft, ChevronLeft, ChevronRight } from "@boxicons/react";

export default function ItemImageSlider({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const router = useRouter();
  const { active, goNext, goPrev, handleTouchStart, handleTouchEnd } =
    useImageSlider(images);

  if (!images?.length)
    return (
      <Box
        w="100%"
        aspectRatio={{ base: "1/1", sm: "4/3", md: "1/1" }}
        maxH={{ sm: "400px", md: "none" }}
        bg="neutral.100"
        borderBottomRadius="xl"
      />
    );

  return (
    <Box position="relative">
      <Box
        w="100%"
        aspectRatio={{ base: "1/1", sm: "4/3", md: "1/1" }}
        maxH={{ sm: "400px", md: "none" }}
        borderBottomRadius="xl"
        overflow="hidden"
        position="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[active]}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Flecha volver */}
        <Box
          as="button"
          onClick={() => router.back()}
          position="absolute"
          top={3}
          left={3}
          w="36px"
          h="36px"
          borderRadius="full"
          bg="whiteAlpha.800"
          alignItems="center"
          display={{ base: "flex", md: "none" }}
          justifyContent="center"
          zIndex={10}
          _hover={{ bg: "neutral.50" }}
          transition="all 0.15s"
        >
          <ChevronsLeft
            width="20px"
            height="20px"
            fill="var(--chakra-colors-neutral-800)"
          />
        </Box>

        {/* Contador */}
        {images.length > 1 && (
          <Box
            position="absolute"
            bottom={3}
            right={3}
            bg="blackAlpha.600"
            borderRadius="full"
            px={3}
            py={1}
          >
            <Text fontSize="xs" color="neutral.50" fontWeight="medium">
              {active + 1}/{images.length}
            </Text>
          </Box>
        )}

        {/* Flechas de navegación */}
        {images.length > 1 && (
          <>
            <Box
              as="button"
              onClick={goPrev}
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              w="36px"
              h="36px"
              borderRadius="full"
              bg="whiteAlpha.800"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: "white" }}
              transition="all 0.15s"
            >
              <ChevronLeft width="22px" height="22px" fill="black" />
            </Box>
            <Box
              as="button"
              onClick={goNext}
              position="absolute"
              right={3}
              top="50%"
              transform="translateY(-50%)"
              w="36px"
              h="36px"
              borderRadius="full"
              bg="whiteAlpha.800"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: "white" }}
              transition="all 0.15s"
            >
              <ChevronRight width="22px" height="22px" fill="black" />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
