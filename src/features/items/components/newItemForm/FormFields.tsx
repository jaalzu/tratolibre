import { Field, Box, Text } from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

// Los estilos que vas a usar en TODO el formulario para que sea consistente
export const inputStyles = {
  borderColor: "neutral.500",
  borderRadius: "lg",
  h: "44px",
  px: "3",
  _focus: { borderColor: "brand.default", boxShadow: "none" },
  _placeholder: { color: "neutral.400" },
};

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}

export const FormField = ({ label, error, children }: FormFieldProps) => (
  <Field.Root invalid={!!error} w="full">
    <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">
      {label}
    </Field.Label>
    {children}
    {error && <Field.ErrorText fontSize="xs">{error.message}</Field.ErrorText>}
  </Field.Root>
);

export const FormHeader = ({ isEditing = false }: { isEditing?: boolean }) => (
  <Box mb={4}>
    <Text fontSize="xl" fontWeight="bold">
      {isEditing ? "Editar publicación" : "Publicar artículo"}
    </Text>
  </Box>
);
