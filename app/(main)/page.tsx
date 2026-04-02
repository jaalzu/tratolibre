import { Box } from "@chakra-ui/react";
import { Hero } from "@/components/sections/Hero";
import { LoggedInHero } from "@/components/sections/LoggedInHero";
import { RecentItemsSection } from "@/features/items/components/home/RecentItemsSection";
import { CheapItemsSection } from "@/features/items/components/home/CheapItemsSection";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getAuthProfile } from "@/features/profile/actions";
import { CategoriesGrid } from "@/components/sections/CategoriesGrid";
import { Suspense } from "react";
import { SectionSkeleton } from "@/components/sections/SectionSkeleton";
import Head from "next/head";
import { InfiniteGrid } from "@/features/items/components/home/InfiniteGrid";
import { PageContainer } from "@/components/ui/PageContainer";
import { getUserFavoriteIds } from "@/features/items/actions";
import { LazySection } from "@/components/ui/LazySection";

export default async function HomePage() {
  const { user } = await getAuthUser();

  const [profile, favoriteIds] = user
    ? await Promise.all([getAuthProfile(), getUserFavoriteIds(user.id)])
    : [null, []];

  return (
    <>
      <Head>
        {!profile && (
          <link
            rel="preload"
            as="image"
            href="/hero/girl-in-pool.webp"
            fetchPriority="high"
          />
        )}
      </Head>

      <Box>
        {profile ? (
          <LoggedInHero name={profile.name} />
        ) : (
          <Hero isLoggedIn={false} />
        )}
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
        <CategoriesGrid />
        <PageContainer pt={4} pb={24}>
          <InfiniteGrid userId={user?.id ?? null} favoriteIds={favoriteIds} />
        </PageContainer>
      </Box>
    </>
  );
}
