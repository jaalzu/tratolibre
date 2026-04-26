import { Box, BoxProps } from "@chakra-ui/react";

interface PageContainerProps extends BoxProps {
  children: React.ReactNode;
}

export function PageContainer({ children, ...props }: PageContainerProps) {
  return (
    <Box
      maxW="1300px"
      mx="auto"
      px={{ base: 3, md: 8 }}
      py={6}
      {...props}
      suppressHydrationWarning
    >
      {children}
    </Box>
  );
}
