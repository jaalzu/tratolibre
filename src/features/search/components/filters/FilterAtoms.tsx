import { Text, Box, Flex, Collapsible } from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "@boxicons/react";

export const SectionTitle = ({ children }: { children: string }) => (
  <Text fontSize="sm" fontWeight="medium" color="neutral.600" mb={1.5}>
    {children}
  </Text>
);

export const OptionButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Box
    as="button"
    onClick={onClick}
    px={4}
    py={2}
    borderRadius="md"
    textAlign="left"
    w="full"
    transition="all 0.15s"
    bg={active ? "brand.subtle" : "transparent"}
    border="1px solid"
    borderColor={active ? "brand.default" : "neutral.200"}
  >
    <Text
      fontSize="sm"
      color={active ? "brand.default" : "neutral.600"}
      fontWeight={active ? "medium" : "normal"}
    >
      {label}
    </Text>
  </Box>
);

export function FilterRow({
  label,
  value,
  expanded,
  onToggle,
  children,
  hideDivider,
}: {
  label: string;
  value: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hideDivider?: boolean;
}) {
  return (
    <Box position="relative" zIndex={expanded ? 10 : 0} borderBottom={hideDivider ? "none" : "1px solid"} borderColor="neutral.100" py={2}>
      <Flex
        as="button"
        w="full"
        align="center"
        justify="space-between"
        py={2}
        onClick={onToggle}
        _hover={{ bg: "neutral.50" }}
        borderRadius="md"
        px={1}
        mx={0}
      >
        <Text fontSize="sm" fontWeight="medium" color="neutral.900">
          {label}
        </Text>
        <Flex align="center" gap={1}>
          <Text
            fontSize="xs"
            color={value === "Todas" || value === "Sin límite" || value === "Cualquier fecha" || value === "Todos" || value === "Todas las provincias" ? "neutral.400" : "brand.default"}
            fontWeight={value === "Todas" || value === "Sin límite" || value === "Cualquier fecha" || value === "Todos" || value === "Todas las provincias" ? "normal" : "medium"}
            maxW="140px"
            truncate
          >
            {value}
          </Text>
          {expanded ? (
            <ChevronUp width="16px" height="16px" fill="var(--chakra-colors-neutral-400)" />
          ) : (
            <ChevronDown width="16px" height="16px" fill="var(--chakra-colors-neutral-400)" />
          )}
        </Flex>
      </Flex>
      <Collapsible.Root open={expanded} unmountOnExit>
        <Collapsible.Content style={{ overflow: "visible" }}>
          <Box pt={2} pb={3} style={{ overflow: "visible" }}>{children}</Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
