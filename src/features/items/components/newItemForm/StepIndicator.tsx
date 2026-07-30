"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

interface StepIndicatorProps {
  steps: { label: string }[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <Flex align="flex-start" w="full" mb={6}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <Flex
            key={step.label}
            align="center"
            flex={i < steps.length - 1 ? 1 : "unset"}
          >
            <Flex direction="column" align="center" gap={1} flexShrink={0}>
              <Flex
                align="center"
                justify="center"
                w="28px"
                h="28px"
                borderRadius="full"
                bg={isCompleted || isActive ? "brand.default" : "neutral.50"}
                color={isCompleted || isActive ? "white" : "neutral.400"}
                border="1px solid"
                borderColor={
                  isCompleted || isActive ? "brand.default" : "neutral.300"
                }
                fontSize="xs"
                fontWeight="bold"
                transition="all 0.15s"
              >
                {isCompleted ? "✓" : i + 1}
              </Flex>
              <Text
                fontSize="10px"
                fontWeight="medium"
                color={isActive ? "brand.default" : "neutral.500"}
                whiteSpace="nowrap"
              >
                {step.label}
              </Text>
            </Flex>

            {i < steps.length - 1 && (
              <Box
                flex={1}
                h="1px"
                bg={isCompleted ? "brand.default" : "neutral.200"}
                mx={2}
                mt="14px"
                transition="all 0.15s"
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};
