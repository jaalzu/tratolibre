import { Box } from "@chakra-ui/react";

interface ChatLayoutProps {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
  mobileH?: string;
}

export function ChatLayout({
  mobile,
  desktop,
  mobileH = "100dvh",
}: ChatLayoutProps) {
  return (
    <>
      <Box
        display={{ base: "flex", md: "none" }}
        flexDirection="column"
        h={mobileH}
        overflow="hidden"
      >
        {mobile}
      </Box>
      <Box
        display={{ base: "none", md: "flex" }}
        h="calc(100dvh - 90px)"
        overflow="hidden"
      >
        {desktop}
      </Box>
    </>
  );
}
