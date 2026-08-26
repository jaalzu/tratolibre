import { Box } from "@chakra-ui/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box bg="bg.canvas" minH="100dvh" display="flex" flexDir="column">
      {children}
    </Box>
  );
}
