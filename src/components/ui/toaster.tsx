"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Portal>
      <ChakraToaster
        toaster={toaster}
        bottom={{ base: "0", md: "12" }}
        insetInline={{ base: "0", md: "25%" }}
        width={{ base: "100vw", md: "auto" }}
      >
        {(toast) => (
          <Toast.Root
            key={toast.id}
            width={{ base: "100%", md: "auto" }}
            maxWidth={{ base: "100%", md: "400px" }}
            borderRadius={{ base: "0", md: "md" }}
            m={{ base: "0", md: "2" }}
            suppressHydrationWarning
          >
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && (
                <Toast.Title fontSize="sm">{toast.title}</Toast.Title>
              )}
              {toast.description && (
                <Toast.Description fontSize="xs">
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
