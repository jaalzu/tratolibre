import { Suspense } from "react";
import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { getAuthProfile } from "@/features/profile/actions";
import { LoggedInHero } from "@/shared/components/sections/LoggedInHero";
import { Hero } from "@/shared/components/sections/Hero";
import { SectionSkeleton } from "@/shared/components/sections/SectionSkeleton";
import { PageContainer } from "@/shared/components/ui/PageContainer";
import { LazySection } from "@/shared/components/ui/LazySection";
import { ItemsSection } from "@/features/items/components/home/ItemsSection";
import { InfiniteGrid } from "@/features/items/components/home/InfiniteGrid";
import dynamic from "next/dynamic";
import { HeroAvatar } from "@/shared/components/sections/HeroAvatar";

const CategoriesGrid = dynamic(
  () =>
    import("@/shared/components/sections/CategoriesGrid").then(
      (mod) => mod.CategoriesGrid,
    ),
  {
    loading: () => <SectionSkeleton />,
    ssr: true,
  },
);

export default async function HomePage() {
  const { user } = await getAuthUser();

  const profile = user ? await getAuthProfile() : null;

  return (
    <main>
      {profile ? (
        <LoggedInHero name={profile.name} avatarSlot={<HeroAvatar />} />
      ) : (
        <Hero isLoggedIn={false} />
      )}

      {/*  Secciones dinámicas con Suspense */}
      <Suspense fallback={<SectionSkeleton />}>
        <ItemsSection
          title="Publicaciones recientes"
          params={{ order_by: "most_relevance", limit: 10 }}
          viewMoreHref="/search"
          userId={user?.id ?? null}
          isPriority={true}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ItemsSection
          title="Los precios más bajos"
          params={{ order_by: "price_asc", limit: 13 }}
          viewMoreHref="/search?order_by=price_asc"
          userId={user?.id ?? null}
        />
      </Suspense>

      <LazySection fallback={<SectionSkeleton />}>
        <CategoriesGrid />
      </LazySection>

      <PageContainer pt={4} pb={24}>
        <InfiniteGrid userId={user?.id ?? null} favoriteIds={[]} />
      </PageContainer>
    </main>
  );
}
