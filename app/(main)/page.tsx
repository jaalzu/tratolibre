import { Suspense } from "react";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getAuthProfile } from "@/features/profile/actions";
import { LoggedInHero } from "@/components/sections/LoggedInHero";
import { Hero } from "@/components/sections/Hero";
import { SectionSkeleton } from "@/components/sections/SectionSkeleton";
import { PageContainer } from "@/components/ui/PageContainer";
import { LazySection } from "@/components/ui/LazySection";
import { ItemsSection } from "@/features/items/components/home/ItemsSection";
import { InfiniteGrid } from "@/features/items/components/home/InfiniteGrid";
import dynamic from "next/dynamic";

const CategoriesGrid = dynamic(
  () =>
    import("@/components/sections/CategoriesGrid").then(
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
        <LoggedInHero name={profile.name} />
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
          // favoriteIds={[]}
          isPriority={true}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ItemsSection
          title="Los precios más bajos"
          params={{ order_by: "price_asc", limit: 13 }}
          viewMoreHref="/search?order_by=price_asc"
          userId={user?.id ?? null}
          // favoriteIds={[]}
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
