// components/ui/FormField.tsx
import { Field, Input, Box } from "@chakra-ui/react";
import {
  UseFormRegister,
  FieldError,
  Path,
  FieldValues,
} from "react-hook-form";

export const inputStyles = {
  borderColor: "neutral.500",
  borderRadius: "lg",
  h: "44px",
  px: "3",
  _focus: { borderColor: "brand.default", boxShadow: "none" },
  _placeholder: { color: "neutral.400" },
};

interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  type?: string;
  placeholder?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
}

export function FormField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  type = "text",
  placeholder,
  required = false,
  rightElement,
}: FormFieldProps<T>) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">
        {label}
        {required && " *"}
      </Field.Label>
      <Box position="relative" w="full">
        <Input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          data-testid={name}
          {...inputStyles}
          pr={rightElement ? "40px" : "3"}
        />
        {rightElement && (
          <Box
            position="absolute"
            right="12px"
            top="50%"
            transform="translateY(-50%)"
          >
            {rightElement}
          </Box>
        )}
      </Box>
      {error && (
        <Field.ErrorText fontSize="xs">{error.message}</Field.ErrorText>
      )}
    </Field.Root>
  );
}
