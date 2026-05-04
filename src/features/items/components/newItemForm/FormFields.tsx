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
    <Flex justify="space-between" align="center" mb="0.2">
      <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">
        {label}
      </Field.Label>
      {helperText && !error && (
        <Text fontSize="10px" color="neutral.500" ml="4px">
          {helperText}
        </Text>
      )}
    </Flex>

    {children}

    <Box h="11px" mt="-6px">
      {error && (
        <Field.ErrorText fontSize="10.3px" lineHeight="1" color="red.500" m="0">
          {error.message}
        </Field.ErrorText>
      )}
    </Box>
  </Field.Root>
);

export const FormHeader = ({ isEditing = false }: { isEditing?: boolean }) => (
  <Box mb={3}>
    <Text fontSize="xl" fontWeight="bold">
      {isEditing ? "Editar publicación" : "Publicar artículo"}
    </Text>
  </Box>
);
