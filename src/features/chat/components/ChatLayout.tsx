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
        h="calc(100vh - 72px)"
        overflow="hidden"
        css={{
          "*::-webkit-scrollbar": {
            width: "5px",
            height: "5px",
          },
          "*::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "*::-webkit-scrollbar-thumb": {
            background: "var(--chakra-colors-neutral-200)",
            borderRadius: "100px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            background: "var(--chakra-colors-neutral-300)",
          },
        }}
      >
        {desktop}
      </Box>
    </>
  );
}
