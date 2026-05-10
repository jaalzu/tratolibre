import { Flex } from "@chakra-ui/react";
import { Card } from "@/shared/components/ui/Card";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterEmailPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center" bg="neutral.150">
      <Card px={6} py={4} w="full" maxW="400px" shadow="base" borderRadius="lg">
        <RegisterForm />
      </Card>
    </Flex>
  );
}
