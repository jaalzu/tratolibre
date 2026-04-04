// app/items/[id]/page.tsx
import { Metadata } from "next";
import { getItemById } from "@/features/items/actions";
import { notFound } from "next/navigation";
import ItemPageContent from "@/features/items/components/publication/ItemPageContent";
import { getAuthUserWithRole } from "@/lib/supabase/getAuthUserWithRole";
import { prefetchItem } from "@/features/items/prefetchItem";
import { ItemPageHydration } from "@/features/items/components/publication/ItemPageHydration";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    return {
      title: "Publicación no encontrada",
    };
  }

  const title = `${item.title}`;
  const description =
    item.description?.slice(0, 150) ?? "Objeto publicado en TratoLibre";

  const image = item.images?.[0] ?? "/og-image.png";

  return {
    title: item.title,
    description,

    openGraph: {
      title: `${item.title} | TratoLibre`,
      description,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, role } = await getAuthUserWithRole();

  // Prefetch del item para SEO y primera carga
  const item = await getItemById(id);
  if (!item) notFound();

  // Hidratar el cache con el item
  const dehydratedState = await prefetchItem(id);

  return (
    <ItemPageHydration state={dehydratedState}>
      <ItemPageContent
        itemId={id}
        userId={user?.id ?? null}
        isAdmin={role === "admin"}
      />
    </ItemPageHydration>
  );
}
