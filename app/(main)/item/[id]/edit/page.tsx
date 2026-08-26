import { getItemById } from "@/features/items/actions";
import { notFound, redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { DynamicNewItemForm } from "@/features/items/components/newItemForm/DynamicNewItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await getAuthUser();
  const result = await getItemById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const item = result.data;

  if (!user || user.id !== item.owner_id) {
    redirect(`/item/${id}`);
  }

  return (
    <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "40px 16px" }}>
      <div style={{ background: "var(--chakra-colors-bg-card)", padding: "24px", borderRadius: "var(--chakra-radii-lg)", boxShadow: "var(--chakra-shadows-base)" }}>
        <DynamicNewItemForm initialData={item} />
      </div>
    </div>
  );
}
