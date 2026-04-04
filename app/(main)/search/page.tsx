// app/search/page.tsx
import { PageContainer } from "@/components/ui/PageContainer";
import { SearchFilterBar } from "@/features/search/components/SearchFilterBar";
import { FilterPanel } from "@/features/search/components/FilterPanel";
import { SearchResults } from "@/features/search/components/SearchResults";
import { SearchPageParams } from "@/features/search/actions";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getUserFavoriteIds } from "@/features/items/actions";
import { Flex } from "@chakra-ui/react";
import type { Metadata } from "next";
import { prefetchSearchItems } from "@/features/search/prefetchSearchItems";
import { SearchHydration } from "@/features/search/components/SearchHydration";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchPageParams>;
}) {
  const params = await searchParams;
  const { user } = await getAuthUser();

  // Prefetch los datos de búsqueda en el servidor
  const dehydratedState = await prefetchSearchItems(params);

  const favoriteIds = user ? await getUserFavoriteIds(user.id) : [];

  return (
    <>
      <SearchFilterBar />
      <PageContainer pt={{ base: 4, md: 8 }} pb={24} px={{ base: 4, md: 8 }}>
        <Flex gap={8} align="flex-start">
          <FilterPanel />
          <SearchHydration state={dehydratedState}>
            <SearchResults
              favoriteIds={favoriteIds}
              userId={user?.id ?? null}
              params={params}
            />
          </SearchHydration>
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
