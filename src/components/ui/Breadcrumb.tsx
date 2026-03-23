import NextLink from "next/link";
import { Flex, Text } from "@chakra-ui/react";
import { CATEGORIES } from "@/lib/constants";

interface BreadcrumbProps {
  category?: string | null;
  title: string;
}

export function Breadcrumb({ category, title }: BreadcrumbProps) {
  const categoryLabel = CATEGORIES.find((cat) => cat.id === category)?.label;

  return (
    <Flex align="center" gap={1.5} mb={4} flexWrap="wrap">
      <NextLink href="/">
        <Text
          fontSize="sm"
          color="neutral.500"
          _hover={{ color: "brand.default" }}
          transition="color 0.15s"
        >
          Inicio
        </Text>
      </NextLink>
      {categoryLabel && (
        <>
          <Text fontSize="sm" color="neutral.300">
            /
          </Text>
          <NextLink href={`/search?category=${category}`}>
            <Text
              fontSize="sm"
              color="neutral.500"
              _hover={{ color: "brand.default" }}
              transition="color 0.15s"
            >
              {categoryLabel}
            </Text>
          </NextLink>
        </>
      )}
      <Text fontSize="sm" color="neutral.300">
        /
      </Text>
      <Text fontSize="sm" color="neutral.800" fontWeight="medium" lineClamp={1}>
        {title}
      </Text>
    </Flex>
  );
}
