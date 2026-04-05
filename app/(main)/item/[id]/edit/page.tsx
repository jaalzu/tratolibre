// EditItemPage.tsx (Server Component)
import { getItemById } from "@/features/items/actions";
import { notFound, redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import dynamic from "next/dynamic";

const NewItemForm = dynamic(
  () =>
    import("@/features/items/components/newItemForm/NewItemForm").then(
      (mod) => mod.NewItemForm,
    ),
  {
    ssr: true,
    loading: () => (
      <div
        style={{
          height: "600px",
          width: "100%",
          background: "#f7fafc",
          borderRadius: "12px",
        }}
      />
    ),
  },
);

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await getAuthUser();
  const item = await getItemById(id);

  if (!item) notFound();
  if (!user || user.id !== item.owner_id) redirect(`/item/${id}`);

  return <NewItemForm initialData={item} />;
}
