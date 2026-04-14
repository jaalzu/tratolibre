"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import { useEffect, useState } from "react"; // 1. Importamos hooks

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  const [mounted, setMounted] = useState(false);

  // 2. Solo se activa cuando el componente se monta en el navegador
  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. Si no está montado, no renderizamos NADA (evita el error de hidratación)
  if (!mounted) return null;

  return (
    <Portal>
      <ChakraToaster toaster={toaster} bottom="12" insetInline={{ md: "25%" }}>
        {(toast) => (
          <Toast.Root key={toast.id}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
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
