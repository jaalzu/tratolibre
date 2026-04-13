import { getItemById } from "@/features/items/actions";
import { notFound, redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { DynamicNewItemForm } from "@/features/items/components/newItemForm/DynamicNewItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await getAuthUser();
  const item = await getItemById(id);

  // Validaciones de seguridad en el Servidor
  if (!item) notFound();
  if (!user || user.id !== item.owner_id) redirect(`/item/${id}`);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <DynamicNewItemForm initialData={item} />
      </div>
    </div>
  );
}
