import { Field, Box, Text, Flex } from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

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
  helperText?: string;
}

export const FormField = ({
  label,
  error,
  children,
  helperText,
}: FormFieldProps) => (
  <Field.Root invalid={!!error} w="full">
    <Flex justify="space-between" align="center" mb="1">
      <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">
        {label}
      </Field.Label>
      {helperText && !error && (
        <Text fontSize="10px" color="neutral.500" px={1}>
          {helperText}
        </Text>
      )}
    </Flex>
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
