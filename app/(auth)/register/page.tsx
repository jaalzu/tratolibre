import { Flex } from "@chakra-ui/react";
import { Card } from "@/components/ui/Card";
import { RegisterOptions } from "@/features/auth/components/RegisterOptions";

export default function RegisterPage() {
  return (
    <Flex minH="100dvh" mx={2} align="center" justify="center">
      <Card w="full" maxW="480px" shadow="base" borderRadius="lg">
        <RegisterOptions />
      </Card>
    </Flex>
  );
}
