"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

interface StepIndicatorProps {
  steps: { label: string }[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <Flex align="flex-start" w="full" mb={6} gap={0}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        const isLast = i === steps.length - 1;

        return (
          <>
            <Flex
              key={step.label}
              direction="column"
              align="center"
              gap={1}
              flexShrink={0}
            >
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
                  isCompleted || isActive ? "brand.default" : "neutral.200"
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
                color={isActive ? "brand.default" : "neutral.400"}
                whiteSpace="nowrap"
              >
                {step.label}
              </Text>
            </Flex>

            {!isLast && (
              <Box
                key={`line-${step.label}`}
                flex={1}
                h="1px"
                bg={isCompleted ? "brand.default" : "neutral.200"}
                mx={{ base: 1, sm: 2 }}
                mt="14px"
                transition="all 0.15s"
              />
            )}
          </>
        );
      })}
    </Flex>
  );
};
