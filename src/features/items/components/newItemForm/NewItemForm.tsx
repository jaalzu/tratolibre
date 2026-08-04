"use client";

import { useState } from "react";
import {
  Stack,
  SimpleGrid,
  Input,
  Textarea,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useController } from "react-hook-form";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { PageContainer } from "@/shared/components/ui/PageContainer";
import { LocationSelector } from "./LocationSelector";
import { ImageUploader } from "./ImageUploader";
import { StepIndicator } from "./StepIndicator";
import { useNewItemForm } from "@/features/items/hooks/useNewItemForm";
import { FormField, FormHeader, inputStyles } from "./FormFields";
import { FormSelect } from "./FormSelect";
import { Item } from "@/features/items/types";
import { ItemFormInput } from "@/features/items/schemas";

const formatArgentinePesos = (value: string) => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const STEPS: { label: string; fields: (keyof ItemFormInput)[] }[] = [
  { label: "Detalles", fields: ["title", "description", "category"] },
  {
    label: "Precio y ubicación",
    fields: ["sale_price", "condition", "province", "city"],
  },
  { label: "Fotos", fields: ["images"] },
];

export const NewItemForm = ({
  initialData,
}: {
  initialData?: Partial<Item>;
}) => {
  const {
    register,
    watch,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    images,
    uploading,
    formState,
    resetFormState,
    handleUpload,
    handleRemove,
    setValue,
    control,
    trigger,
  } = useNewItemForm(initialData);

  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length - 1;

  const titleValue = watch("title", "");
  const descValue = watch("description", "");

  const { field: categoryField } = useController({
    name: "category",
    control,
  });

  const { field: conditionField } = useController({
    name: "condition",
    control,
  });

  const handleNext = async () => {
    const valid = await trigger(STEPS[step].fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <PageContainer maxW="4xl" pb={{ base: 24, lg: 10 }} pt={3}>
      <FormHeader isEditing={!!initialData} />

      <StepIndicator steps={STEPS} currentStep={step} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card p="6">
          <Stack gap="4">
            {/* Step 0: Detalles */}
            <Stack gap="4" display={step === 0 ? "flex" : "none"}>
              <FormField
                label="Título"
                error={errors.title}
                helperText={`${titleValue.length}/60`}
              >
                <Input
                  {...register("title")}
                  maxLength={80}
                  data-testid="title"
                  placeholder="Ej: iPhone 11"
                  {...inputStyles}
                />
              </FormField>

              <FormField
                label="Descripción"
                error={errors.description}
                helperText={`${descValue.length}/600`}
              >
                <Textarea
                  {...register("description")}
                  maxLength={600}
                  data-testid="description"
                  rows={3}
                  p={2}
                  placeholder="Detalles del producto..."
                  {...inputStyles}
                  h="auto"
                />
              </FormField>

              <FormField label="Categoría" error={errors.category}>
                <FormSelect
                  value={categoryField.value ?? ""}
                  onChange={categoryField.onChange}
                  options={CATEGORIES.map((category) => ({
                    id: category.id,
                    label: category.label,
                    iconClass: category.icon,
                  }))}
                  placeholder="Elegí una..."
                  invalid={!!errors.category}
                />
              </FormField>
            </Stack>

            {/* Step 1: Precio y ubicación */}
            <Stack gap="4" display={step === 1 ? "flex" : "none"}>
              <SimpleGrid
                columns={{ base: 1, sm: 2 }}
                gap={{ base: "1", md: "4" }}
              >
                <FormField label="Precio ($)" error={errors.sale_price as any}>
                  <Input
                    {...register("sale_price")}
                    data-testid="sale_price"
                    type="text"
                    inputMode="numeric"
                    placeholder="Ej: 300.000"
                    {...inputStyles}
                    onChange={(e) => {
                      e.target.value = formatArgentinePesos(e.target.value);
                      register("sale_price").onChange(e);
                    }}
                  />
                </FormField>

                <FormField label="Estado" error={errors.condition}>
                  <FormSelect
                    value={conditionField.value ?? ""}
                    onChange={conditionField.onChange}
                    options={CONDITIONS.map((c) => ({
                      id: c.id,
                      label: c.label,
                    }))}
                    placeholder="Estado..."
                    invalid={!!errors.condition}
                  />
                </FormField>
              </SimpleGrid>

              <LocationSelector
                errors={errors}
                register={register}
                setValue={setValue}
              />
            </Stack>

            {/* Step 2: Fotos */}
            <Stack gap="4" display={step === 2 ? "flex" : "none"}>
              <ImageUploader
                images={images}
                uploading={uploading}
                onUpload={handleUpload}
                onRemove={handleRemove}
                error={errors.images?.message}
              />
            </Stack>

            {/* Manejo de error con discriminated union */}
            {formState.status === "error" && (
              <Text
                fontSize="xs"
                color="red.500"
                textAlign="center"
                fontWeight="bold"
                cursor="pointer"
                onClick={resetFormState}
              >
                {formState.message}
              </Text>
            )}

            <Flex gap={3}>
              {step > 0 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  flex={1}
                  py={1.5}
                  borderRadius="full"
                  bg="neutral.100"
                  color="neutral.700"
                  _hover={{ bg: "neutral.200" }}
                >
                  Atrás
                </Button>
              )}

              {!isLastStep && (
                <Button
                  type="button"
                  onClick={handleNext}
                  flex={1}
                  py={1.5}
                  borderRadius="full"
                >
                  Siguiente
                </Button>
              )}

              {isLastStep && (
                <Button
                  type="submit"
                  flex={1}
                  py={1.5}
                  borderRadius="full"
                  data-testid="submit-item"
                  loading={isSubmitting}
                >
                  {initialData ? "Guardar cambios" : "Publicar ahora"}
                </Button>
              )}
            </Flex>
          </Stack>
        </Card>
      </form>
    </PageContainer>
  );
};
