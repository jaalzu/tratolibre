// app/page.tsx
import { Box } from "@chakra-ui/react";
import { LoggedInHero } from "@/components/sections/LoggedInHero";
import { RecentItemsSection } from "@/features/items/components/home/RecentItemsSection";
import { CheapItemsSection } from "@/features/items/components/home/CheapItemsSection";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getAuthProfile } from "@/features/profile/actions";
import { CategoriesGrid } from "@/components/sections/CategoriesGrid";
import { Suspense } from "react";
import { SectionSkeleton } from "@/components/sections/SectionSkeleton";
import { PageContainer } from "@/components/ui/PageContainer";
import { getUserFavoriteIds } from "@/features/items/actions";
import { LazySection } from "@/components/ui/LazySection";
import dynamic from "next/dynamic";
import { InfiniteGrid } from "@/features/items/components/home/InfiniteGrid";
import { prefetchMultipleItems } from "@/features/items/prefetchItems";
import { ItemsHydration } from "@/features/items/components/ItemsHydration";

const Hero = dynamic(
  () => import("@/components/sections/Hero").then((mod) => mod.Hero),
  { ssr: true },
);

export default async function HomePage() {
  const { user } = await getAuthUser();

  const dehydratedState = await prefetchMultipleItems([
    { order_by: "most_relevance" },
    { order_by: "price_asc" },
  ]);

  const [profile, favoriteIds] = user
    ? await Promise.all([getAuthProfile(), getUserFavoriteIds(user.id)])
    : [null, []];

  return (
    <Box>
      {profile ? (
        <LoggedInHero name={profile.name} />
      ) : (
        <Hero isLoggedIn={false} />
      )}

      {/* Envolver las secciones con ItemsHydration para compartir el cache */}
      <ItemsHydration state={dehydratedState}>
        <Suspense fallback={<SectionSkeleton />}>
          <RecentItemsSection
            userId={user?.id ?? null}
            favoriteIds={favoriteIds}
          />
        </Suspense>

        <LazySection fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <CheapItemsSection
              userId={user?.id ?? null}
              favoriteIds={favoriteIds}
            />
          </Suspense>
        </LazySection>
      </ItemsHydration>

      <CategoriesGrid />

      <PageContainer pt={4} pb={24}>
        <InfiniteGrid userId={user?.id ?? null} favoriteIds={favoriteIds} />
      </PageContainer>
    </Box>
  );
}
