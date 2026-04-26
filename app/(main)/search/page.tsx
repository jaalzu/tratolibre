import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/PageContainer";
import { SearchFilterBar } from "@/features/search/components/SearchFilterBar";
import { DynamicFilterPanel } from "@/features/search/components/DynamicFilterPanel";
import { SearchResults } from "@/features/search/components/SearchResults";
import { SearchPageParams } from "@/features/search/types";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getUserFavoriteIds } from "@/features/items/actions";
import { Flex } from "@chakra-ui/react";
// import { prefetchSearchItems } from "@/features/search/prefetchSearchItems";
// import { SearchHydration } from "@/features/search/components/SearchHydration";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchPageParams>;
}) {
  const params = await searchParams;
  const { user } = await getAuthUser();

  // Prefetch de datos en el servidor (React Query)
  // const dehydratedState = await prefetchSearchItems(params);

  // ✅ Verificamos favoritos si hay usuario con manejo de Result
  const favoriteIdsResult = user ? await getUserFavoriteIds(user.id) : null;
  const favoriteIds = favoriteIdsResult?.success ? favoriteIdsResult.data : [];

  return (
    <>
      <SearchFilterBar />
      <PageContainer pt={{ base: 4, md: 8 }} pb={24} px={{ base: 4, md: 8 }}>
        <Flex gap={8} align="flex-start">
          <DynamicFilterPanel />

          <SearchResults
            favoriteIds={favoriteIds}
            userId={user?.id ?? null}
            params={params}
          />
        </Flex>
      </PageContainer>
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchPageParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const term = params.keywords ?? params.category ?? null;

  const title = term ? term : "Explorar";
  const description = term
    ? `Resultados para "${term}" en TratoLibre`
    : "Explorá objetos en TratoLibre";

  return {
    title,
    description,
    robots: { index: false },
  };
}
