"use client";

import { Text, Flex, Box, chakra } from "@chakra-ui/react";
import { Button } from "@/shared/components/ui/Button";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useStartChat } from "@/features/items/hooks/useStartChat";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { SelectBuyerDialog } from "@/features/items/components/publication/SelectBuyerDialog";
import { deleteItemAction } from "@/features/items/actions";
import { AdminDeleteButton } from "@/features/admin/components/ui/AdminDeleteButton";
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
        bottom={{ base: "60px", md: 0 }}
        left={0}
        right={0}
        p={{ base: 3, md: 0 }}
        bg="bg.card"
        zIndex={100}
      >
        <Button
          asChild
          variant="accent"
          width="full"
          p={{ base: 1, md: 1 }}
          borderRadius="lg"
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
              <Flex gap={2} width="full">
                <Button
                  asChild
                  variant="accent"
                  flex={1}
                  borderRadius="md"
                  py={1}
                >
                  <NextLink href={`/item/${item.id}/edit`}>
                    Editar
                  </NextLink>
                </Button>
                <Button
                  flex={1}
                  borderRadius="md"
                  py={1}
                  bg="feedback.error"
                  onClick={() => setOpen(true)}
                  data-testid="delete-item-button"
                  _hover={{ opacity: 0.85 }}
                >
                  Eliminar
                </Button>
              </Flex>
              <Flex justify="center" width="full" mt={1}>
                <chakra.button
                  type="button"
                  fontSize="sm"
                  color="accent.default"
                  textAlign="center"
                  cursor="pointer"
                  textDecoration="underline"
                  aria-haspopup="dialog"
                  onClick={() => setSoldOpen(true)}
                  _hover={{ color: "accent.hover" }}
                  bg="transparent"
                  border="none"
                  p="0"
                >
                  Marcar como vendido
                </chakra.button>
              </Flex>
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
        variant="accent"
        width="full"
        borderRadius="lg"
        py={1.5}
        onClick={handleContact}
        loading={loading}
        data-testid="contact-seller-button"
      >
        Contactar vendedor
      </Button>
    </Flex>
  );
}
