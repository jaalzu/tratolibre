"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ReportModal } from "@/features/reports/components/ReportModal";
import { useState, useRef, useEffect } from "react";
import NextLink from "next/link";
import { useDeleteConversation } from "../../hooks/useDeleteConversation";

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
      icon: "bx-link-external",
      href: `/item/${itemId}`,
    },
    {
      label: "Ver perfil",
      icon: "bx-user",
      href: `/profile/${otherUserId}`,
      prefetch: false,
    },
    {
      label: "Reportar usuario",
      icon: "bx-flag",
      color: "feedback.error",
      onClick: () => setReportOpen(true),
    },
    {
      label: "Eliminar conversación",
      icon: "bx-trash",
      color: "feedback.error",
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
      >
        <i
          className="bx bx-dots-vertical-rounded"
          style={{ fontSize: "24px", color: "white" }}
        />
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
          minW="150px"
          overflow="hidden"
        >
          {options.map((opt) =>
            opt.href ? (
              <NextLink
                key={opt.label}
                href={opt.href}
                onClick={() => setOpen(false)}
              >
                <Flex
                  align="center"
                  gap="2"
                  px="2"
                  py="3"
                  _hover={{ bg: "neutral.50" }}
                  cursor="pointer"
                >
                  <i
                    className={`bx ${opt.icon}`}
                    style={{
                      fontSize: "16px",
                      color: "var(--chakra-colors-neutral-500)",
                    }}
                  />
                  <Text fontSize="sm" color="neutral.700">
                    {opt.label}
                  </Text>
                </Flex>
              </NextLink>
            ) : (
              <Flex
                key={opt.label}
                align="center"
                gap="2"
                px="2"
                py="3"
                _hover={{ bg: "neutral.50" }}
                cursor="pointer"
                onClick={() => {
                  opt.onClick?.();
                  setOpen(false);
                }}
              >
                <i
                  className={`bx ${opt.icon}`}
                  style={{
                    fontSize: "16px",
                    color: "var(--chakra-colors-feedback-error)",
                  }}
                />
                <Text fontSize="sm" color="feedback.error">
                  {opt.label}
                </Text>
              </Flex>
            ),
          )}
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
