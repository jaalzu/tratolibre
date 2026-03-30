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
      <ChakraToaster
        toaster={toaster}
        bottom="12" // Un toque más arriba para que destaque
        insetInline={{ md: "25%" }} // 50% de ancho en desktop
      >
        {(toast) => (
          <Toast.Root
            key={toast.id}
            width="full"
            borderRadius="2xl" // Bordes aún más redondeados para que sea pro
            px="6"
            py="4"
            shadow="2xl"
            bg="red.600" // FONDO ROJO
            color="white" // LETRAS BLANCAS
            border="none"
          >
            {toast.type === "loading" ? (
              <Spinner size="sm" color="white" />
            ) : (
              // Forzamos el color blanco al icono si existe
              <Toast.Indicator color="white" />
            )}

            <Stack gap="1" flex="1" textAlign="center" alignItems="center">
              {toast.title && (
                <Toast.Title
                  fontWeight="bold"
                  fontSize="md" // Letra más grande
                  lineHeight="shorter"
                >
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description
                  fontSize="sm" // Descripción también más legible
                  color="whiteAlpha.900"
                >
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
