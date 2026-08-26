"use client";

import { useState } from "react";
import { Stack, SimpleGrid, Input, Textarea, Text, Flex, Box } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { PageContainer } from "@/shared/components/ui/PageContainer";
import { LocationSelector } from "./LocationSelector";
import { ImageUploader } from "./ImageUploader";
import { useNewItemForm } from "@/features/items/hooks/useNewItemForm";
import { FormField, FormHeader, inputStyles } from "./FormFields";
import FormSelect from "./FormSelect";
import { Item } from "@/features/items/types";
import { ItemFormInput } from "@/features/items/schemas";

const formatArgentinePesos = (value: string) => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const STEPS: { label: string; fields: (keyof ItemFormInput)[] }[] = [
  { label: "Fotos y detalles", fields: ["images", "title", "description", "sale_price"] },
  { label: "Precio y ubicación", fields: ["category", "condition", "province", "city", "location"] },
];

export const NewItemForm = ({ initialData }: { initialData?: Partial<Item> }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { register, watch, handleSubmit, onSubmit, errors, isSubmitting, images, uploading, formState, resetFormState, handleUpload, handleRemove, trigger, setValue, control } = useNewItemForm(initialData);

  const titleValue = watch("title", "");
  const descValue = watch("description", "");
  const { field: categoryField } = useController({ name: "category", control });
  const { field: conditionField } = useController({ name: "condition", control });

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await trigger(["images", "title", "description", "sale_price"]);
    } else if (currentStep === 1) {
      isValid = await trigger(["category", "condition", "province"]);
    }
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };
  const handlePrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <PageContainer maxW="5xl" pb={{ base: 24, lg: 10 }} pt={3}>
      <FormHeader isEditing={!!initialData} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card p="5">
          <Stack gap="4">
            {currentStep === 0 && (
              <Stack gap={4}>
                <ImageUploader images={images} uploading={uploading} onUpload={handleUpload} onRemove={handleRemove} error={errors.images?.message} />
                <FormField label="Título" error={errors.title} helperText={`${titleValue.length}/60`}>
                  <Input {...register("title")} maxLength={80} data-testid="title" placeholder="Ej: iPhone 11" {...inputStyles} />
                </FormField>
                <FormField label="Descripción" error={errors.description} helperText={`${descValue.length}/600`}>
                  <Textarea {...register("description")} maxLength={599} data-testid="description" rows={3} p={4} placeholder="Detalles del producto..." {...inputStyles} h="auto" />
                </FormField>
                <FormField label="Precio ($)" error={errors.sale_price as any}>
                  <Box maxW={{ base: "160px", sm: "200px" }}><Input {...register("sale_price")} data-testid="sale_price" type="text" inputMode="numeric" placeholder="Ej: 300.000" {...inputStyles} onChange={(e) => { e.target.value = formatArgentinePesos(e.target.value); register("sale_price").onChange(e); }} /></Box>
                </FormField>
              </Stack>
            )}

            {currentStep === 1 && (
              <Stack gap={4}>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: "1", md: "4" }}>
                  <FormField label="Categoría" error={errors.category}>
                    <FormSelect value={categoryField.value ?? ""} onChange={categoryField.onChange} options={CATEGORIES.map((c) => ({ id: c.id, label: c.label, iconClass: c.icon }))} placeholder="Elegí una..." invalid={!!errors.category} />
                  </FormField>
                  <FormField label="Estado" error={errors.condition}>
                    <FormSelect value={conditionField.value ?? ""} onChange={conditionField.onChange} options={CONDITIONS.map((c) => ({ id: c.id, label: c.label }))} placeholder="Estado..." invalid={!!errors.condition} />
                  </FormField>
                </SimpleGrid>
                <LocationSelector errors={errors} register={register} setValue={setValue} />
              </Stack>
            )}

            {formState.status === "error" && <Text fontSize="xs" color="feedback.error" textAlign="center" fontWeight="bold" cursor="pointer" onClick={resetFormState}>{formState.message}</Text>}

            <Flex gap={3} mt={4}>
              {currentStep > 0 && <Button type="button" variant="secondary" py={1.5} width="full" onClick={handlePrevStep}>Atrás</Button>}
              {currentStep < STEPS.length - 1 ? <Button type="button" py={1.5} width="full" onClick={handleNextStep}>Siguiente</Button> : <Button type="submit" py={1.5} width="full" data-testid="submit-item" loading={isSubmitting}>{initialData ? "Guardar cambios" : "Publicar ahora"}</Button>}
            </Flex>
          </Stack>
        </Card>
      </form>
    </PageContainer>
  );
};
