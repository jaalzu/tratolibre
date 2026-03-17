import Image from "next/image";
import { Box, Grid } from "@chakra-ui/react";
const photos = [
  "/login/bike-login.webp",
  "/login/phones-login.webp",
  "/login/guy-in-subte.webp",
  "/login/deal-login.webp",
];

const accents = ["brand.default", "secondary.default", "accent.hover", "red"];

const areas = [
  { colSpan: 2, rowSpan: 2, h: "120px" }, // bike — ocupa 2 cols, 2 rows
  { colSpan: 1, rowSpan: 1, h: "50px" }, // phones — 1 col, 1 row
  { colSpan: 1, rowSpan: 2, h: "120px" }, // guy-in-subte — 1 col, 2 rows ← ocupa todo el alto
  { colSpan: 2, rowSpan: 1, h: "50px" }, // deal — 1 col, 1 row
];

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
        <Box
          position="relative"
          w="100%"
          h={areas[i].h}
          borderRadius="xl"
          overflow="hidden"
          zIndex={1}
        >
          <Image
            src={src}
            alt={`photo-${i}`}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
      </Box>
    ))}
  </Grid>
);
