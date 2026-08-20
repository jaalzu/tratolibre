"use client";

import { useState } from "react";
import {
  Stack,
  SimpleGrid,
  Input,
  Textarea,
  Text,
  Flex,
  Box,
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
import FormSelect from "./FormSelect";
import { Item } from "@/features/items/types";

const formatArgentinePesos = (value: string) => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const STEPS = [
  { label: "Información" },
  { label: "Ubicación" },
  { label: "Fotos" },
];

export const NewItemForm = ({
  initialData,
}: {
  initialData?: Partial<Item>;
}) => {
  const [currentStep, setCurrentStep] = useState(0);

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
    trigger,
    setValue,
    control,
  } = useNewItemForm(initialData);

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

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await trigger([
        "title",
        "description",
        "category",
        "condition",
        "sale_price",
      ]);
    } else if (currentStep === 1) {
      isValid = await trigger(["location"]);
    } else {
      isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <PageContainer maxW="5xl" pb={{ base: 24, lg: 10 }} pt={3}>
      <FormHeader isEditing={!!initialData} />

      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card p="5">
          <Stack gap="4">
            {currentStep === 0 && (
              <>
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
                    p={4}
                    placeholder="Detalles del producto..."
                    {...inputStyles}
                    h="auto"
                  />
                </FormField>

                <SimpleGrid
                  columns={{ base: 1, sm: 3 }}
                  gap={{ base: "1", md: "4" }}
                >
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

                  <FormField
                    label="Precio ($)"
                    error={errors.sale_price as any}
                  >
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
                </SimpleGrid>
              </>
            )}

            {currentStep === 1 && (
              <LocationSelector
                errors={errors}
                register={register}
                setValue={setValue}
              />
            )}

            {currentStep === 2 && (
              <ImageUploader
                images={images}
                uploading={uploading}
                onUpload={handleUpload}
                onRemove={handleRemove}
                error={errors.images?.message}
              />
            )}

            {/*  Manejo de error con discriminated union */}
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

            <Flex gap={3} mt={4}>
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  py={1.5}
                  width="full"
                  onClick={handlePrevStep}
                >
                  Atrás
                </Button>
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  py={1.5}
                  width="full"
                  onClick={handleNextStep}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="submit"
                  py={1.5}
                  width="full"
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
