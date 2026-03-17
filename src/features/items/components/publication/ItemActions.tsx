"use client";

import { Text, Flex, Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useStartChat } from "@/features/items/hooks/useStartChat";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SelectBuyerDialog } from "@/features/items/components/publication/SelectBuyerDialog";
import { deleteItemAction } from "@/features/items/actions";
import { AdminDeleteButton } from "@/features/admin/components/shared/AdminDeleteButton";
import { ItemWithProfile } from "@/features/items/types";

interface ItemActionsProps {
  item: ItemWithProfile;
  userId: string | null;
  isAdmin?: boolean;
}

export default function ItemActions({
  item,
  userId,
  isAdmin = false,
}: ItemActionsProps) {
  const router = useRouter();
  const { startChat, loading } = useStartChat();
  const [open, setOpen] = useState(false);
  const [soldOpen, setSoldOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleContact = () => {
    if (!userId) return router.push("/login");
    if (!item?.id || !item?.profiles?.id) return;
    startChat(item.id, item.profiles.id);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await deleteItemAction(item.id);
    setDeleting(false);
  };

  if (!userId)
    return (
      <Box
        position={{ base: "fixed", md: "static" }}
        bottom={0}
        left={0}
        right={0}
        p={{ base: 5, md: 0 }}
        bg="neutral.150"
        zIndex={100}
      >
        <Button
          asChild
          width="full"
          p={{ base: 3, md: 2 }}
          borderRadius="xl"
          bg="accent.default"
          _hover={{ opacity: 0.9 }}
        >
          <NextLink href="/login">Iniciar sesión para contactar</NextLink>
        </Button>
      </Box>
    );

  if (item.profiles?.id === userId)
    return (
      <>
        <Flex direction="column" gap={2}>
          {!item.sold && (
            <>
              <Text
                fontSize="md"
                color="neutral.800"
                textAlign="center"
                cursor="pointer"
                textDecoration="underline"
                onClick={() => setSoldOpen(true)}
                _hover={{ color: "neutral.900" }}
              >
                Marcar como vendido
              </Text>
              <Button
                asChild
                width="full"
                borderRadius="2xl"
                py={1}
                _hover={{ opacity: 0.85 }}
              >
                <NextLink href={`/item/${item.id}/edit`}>
                  Editar publicación
                </NextLink>
              </Button>
              <Button
                width="full"
                borderRadius="2xl"
                py={1}
                bg="feedback.error"
                onClick={() => setOpen(true)}
                _hover={{ opacity: 0.85 }}
              >
                Eliminar
              </Button>
            </>
          )}
        </Flex>

        <SelectBuyerDialog
          open={soldOpen}
          onClose={() => setSoldOpen(false)}
          itemId={item.id}
          itemTitle={item.title}
        />

        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleDelete}
          title="¿Eliminár publicación?"
          description="Esta acción no se puede deshacer. La publicación será eliminada permanentemente."
          loading={deleting}
          loadingLabel="Eliminando..."
        />
      </>
    );

  if (item.sold)
    return (
      <Text
        fontSize="lg"
        color="feedback.error"
        fontWeight="bold"
        textAlign="center"
      >
        Vendido
      </Text>
    );

  return (
    <Flex direction="column" gap={2}>
      {isAdmin && <AdminDeleteButton itemId={item.id} />}
      <Button
        width="full"
        borderRadius="2xl"
        bg="accent.default"
        py={1.5}
        onClick={handleContact}
        loading={loading}
      >
        Contactar vendedor
      </Button>
    </Flex>
  );
}
