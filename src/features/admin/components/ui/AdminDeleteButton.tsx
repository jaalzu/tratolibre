"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteItemAsAdminAction } from "@/features/admin/actions";

export function AdminDeleteButton({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteItemAsAdminAction(itemId);
    setLoading(false);
  }

  return (
    <>
      <Button
        width="full"
        borderRadius="2xl"
        py={1.5}
        bg="feedback.error"
        onClick={() => setOpen(true)}
        _hover={{ opacity: 0.85 }}
      >
        Eliminar publicación
      </Button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar publicación"
        description="Esto eliminará la publicación y todas sus imágenes. No se puede deshacer."
        confirmLabel="Eliminar"
        loading={loading}
        loadingLabel="Eliminando..."
      />
    </>
  );
}
