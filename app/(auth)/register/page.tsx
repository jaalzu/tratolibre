import { Flex } from "@chakra-ui/react";
import { Card } from "@/components/ui/Card";
import { RegisterOptions } from "@/features/auth/components/RegisterOptions";

export default function RegisterPage() {
  return (
    <Flex minH="100vh" mx={2} align="center" justify="center" bg="neutral.150">
      <Card w="full" maxW="480px" shadow="base" borderRadius="lg">
        <RegisterOptions />
      </Card>
    </Flex>
  );
}
