import type { Metadata } from "next";
import { getUserProfile } from "@/features/profile/actions";
import { ProfileView } from "@/features/profile/components/ProfileView";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getUserProfile(id);
  if (!data) return { title: "Perfil no encontrado" };

  const title = data.profile.name ?? "Usuario";
  const description = `Perfil de ${title} en TratoLibre`;
  const image = data.profile.avatar_url ?? "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | TratoLibre`,
      description,
      images: [{ url: image, width: 800, height: 800 }],
    },
    twitter: {
      card: "summary",
      title: `${title} | TratoLibre`,
      description,
      images: [image],
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getUserProfile(id);
  if (!data) notFound();

  return (
    <ProfileView
      profile={data.profile}
      items={data.items}
      salesCount={data.salesCount}
      purchasesCount={data.purchasesCount}
      isOwner={false}
    />
  );
}
