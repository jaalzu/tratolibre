import { Box } from "@chakra-ui/react";
import { Hero } from "@/components/sections/Hero";
import { LoggedInHero } from "@/components/sections/LoggedInHero";
import { RecentItemsSection } from "@/features/items/components/home/RecentItemsSection";
import { NearbyItemsSection } from "@/features/items/components/home/NearbyItemsSection";
import { CheapItemsSection } from "@/features/items/components/home/CheapItemsSection";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getAuthProfile } from "@/features/profile/actions";
import { CategoriesGrid } from "@/components/sections/CategoriesGrid";
import { Suspense } from "react";
import { SectionSkeleton } from "@/components/sections/SectionSkeleton";

export default async function HomePage() {
  const { user } = await getAuthUser();
  const profile = user ? await getAuthProfile() : null;

  return (
    <Box>
      {profile ? (
        <>
          <LoggedInHero name={profile.name} />
        </>
      ) : (
        <>
          <Hero isLoggedIn={false} />
        </>
      )}
      <Suspense fallback={<SectionSkeleton />}>
        <RecentItemsSection userId={user?.id ?? null} />
      </Suspense>
      <CategoriesGrid />
      <Suspense fallback={<SectionSkeleton />}>
        <NearbyItemsSection userId={user?.id ?? null} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <CheapItemsSection userId={user?.id ?? null} />
      </Suspense>
    </Box>
  );
}
