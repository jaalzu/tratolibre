import { LoggedInHero } from "@/components/sections/LoggedInHero";
import { RecentItemsSection } from "@/features/items/components/home/RecentItemsSection";
import { CheapItemsSection } from "@/features/items/components/home/CheapItemsSection";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getAuthProfile } from "@/features/profile/actions";
import { Suspense } from "react";
import { SectionSkeleton } from "@/components/sections/SectionSkeleton";
import { PageContainer } from "@/components/ui/PageContainer";
import { getUserFavoriteIds } from "@/features/items/actions";
import { LazySection } from "@/components/ui/LazySection";
import { InfiniteGrid } from "@/features/items/components/home/InfiniteGrid";
// import { prefetchMultipleItems } from "@/features/items/prefetch/prefetchItems";
// import { ItemsHydration } from "@/features/items/components/ItemsHydration";
import { Hero } from "@/components/sections/Hero";
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

  // const dehydratedState = await prefetchMultipleItems([
  //   { order_by: "most_relevance" },
  //   { order_by: "price_asc" },
  // ]);

  const [profile, favoriteIdsResult] = user
    ? await Promise.all([getAuthProfile(), getUserFavoriteIds(user.id)])
    : [null, null];

  const favoriteIds = favoriteIdsResult?.success ? favoriteIdsResult.data : [];

  return (
    <main>
      {profile ? (
        <LoggedInHero name={profile.name} />
      ) : (
        <Hero isLoggedIn={false} />
      )}

      {/* <ItemsHydration state={dehydratedState}> */}
      <Suspense fallback={<SectionSkeleton />}>
        <RecentItemsSection
          userId={user?.id ?? null}
          favoriteIds={favoriteIds}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CheapItemsSection
          userId={user?.id ?? null}
          favoriteIds={favoriteIds}
        />
      </Suspense>
      {/* </ItemsHydration> */}

      <LazySection fallback={<SectionSkeleton />}>
        <CategoriesGrid />
      </LazySection>

      <PageContainer pt={4} pb={24}>
        <InfiniteGrid userId={user?.id ?? null} favoriteIds={favoriteIds} />
      </PageContainer>
    </main>
  );
}
