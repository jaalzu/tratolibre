"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} bottom="12" insetInline={{ md: "25%" }}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            width="full"
            borderRadius="2xl"
            px="6"
            py="4"
            shadow="2xl"
            bg="red.600"
            color="white"
            border="none"
          >
            {toast.type === "loading" ? (
              <Spinner size="sm" color="white" />
            ) : (
              <Toast.Indicator color="white" />
            )}

            <Stack gap="1" flex="1" textAlign="center" alignItems="center">
              {toast.title && (
                <Toast.Title
                  fontWeight="bold"
                  fontSize="md"
                  lineHeight="shorter"
                >
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description fontSize="sm" color="whiteAlpha.900">
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>

            <Toast.CloseTrigger
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              position="absolute"
              right="2"
              top="2"
            />
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
