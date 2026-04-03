"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ReportModal } from "@/features/reports/components/ReportModal";
import { useState, useRef, useEffect } from "react";
import NextLink from "next/link";
import { useDeleteConversation } from "../../hooks/useDeleteConversation";
import { DotsVerticalRounded, Link, User, Flag, Trash } from "@boxicons/react";

interface ChatMenuProps {
  itemId: string;
  conversationId: string;
  otherUserId: string;
}

export const ChatMenu = ({
  itemId,
  conversationId,
  otherUserId,
}: ChatMenuProps) => {
  const [open, setOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { deleteConversation, isDeleting } = useDeleteConversation();

  const handleDelete = async () => {
    const success = await deleteConversation(conversationId);
    if (success) setConfirmOpen(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = [
    {
      label: "Ver publicación",
      Icon: Link,
      href: `/item/${itemId}`,
      iconColor: "var(--chakra-colors-neutral-500)",
      textColor: "neutral.700",
    },
    {
      label: "Ver perfil",
      Icon: User,
      href: `/profile/${otherUserId}`,
      prefetch: false,
      iconColor: "var(--chakra-colors-neutral-500)",
      textColor: "neutral.700",
    },
    {
      label: "Reportar usuario",
      Icon: Flag,
      iconColor: "var(--chakra-colors-feedback-error)",
      textColor: "feedback.error",
      onClick: () => setReportOpen(true),
    },
    {
      label: "Eliminar conversación",
      Icon: Trash,
      iconColor: "var(--chakra-colors-feedback-error)",
      textColor: "feedback.error",
      onClick: () => setConfirmOpen(true),
    },
  ];

  return (
    <Box position="relative" ref={ref}>
      <Box
        cursor="pointer"
        p={1}
        borderRadius="md"
        _hover={{ bg: "whiteAlpha.200" }}
        onClick={() => setOpen(!open)}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <DotsVerticalRounded width="24px" height="24px" fill="white" />
      </Box>

      {open && (
        <Box
          position="absolute"
          right="0"
          top="36px"
          bg="neutral.50"
          borderRadius="xl"
          border="1px solid"
          borderColor="neutral.100"
          zIndex={50}
          minW="180px"
          overflow="hidden"
          boxShadow="sm"
        >
          {options.map((opt) => {
            const Content = (
              <Flex
                align="center"
                gap="3"
                px="3"
                py="3"
                _hover={{ bg: "neutral.100" }}
                cursor="pointer"
                transition="background 0.2s"
              >
                <opt.Icon width="18px" height="18px" fill={opt.iconColor} />
                <Text fontSize="sm" color={opt.textColor} fontWeight="medium">
                  {opt.label}
                </Text>
              </Flex>
            );

            return opt.href ? (
              <NextLink
                key={opt.label}
                href={opt.href}
                onClick={() => setOpen(false)}
                prefetch={opt.prefetch}
              >
                {Content}
              </NextLink>
            ) : (
              <Box
                key={opt.label}
                onClick={() => {
                  opt.onClick?.();
                  setOpen(false);
                }}
              >
                {Content}
              </Box>
            );
          })}
        </Box>
      )}

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        type="conversation"
        targetId={conversationId}
      />
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar conversación"
        description="Esta acción no se puede deshacer."
        loading={isDeleting}
        loadingLabel="Eliminando conversación..."
      />
    </Box>
  );
};
