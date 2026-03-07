import { PageContainer } from '@/components/ui/PageContainer'
import { SearchFilterBar } from '@/features/search/components/SearchFilterBar'
import { FilterPanel } from '@/features/search/components/FilterPanel'
import { SearchResults } from '@/features/search/components/SearchResults'
import { getSearchPageData, SearchPageParams } from '@/features/search/actions'
import { getAuthUser } from '@/lib/supabase/getAuthUser'
import { Flex } from '@chakra-ui/react'


export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchPageParams> }) {
    const params = await searchParams
    const { user } = await getAuthUser()
    const { items, favoriteIds, title } = await getSearchPageData(params, user?.id ?? null)
  
    return (
    <>
      <SearchFilterBar />
      <PageContainer  pt={{ base: 4, md: 8 }} pb={24} px={{ base: 4, md: 8 }}>
        <Flex gap={8} align="flex-start">
          <FilterPanel />
          <SearchResults
            items={items}
            favoriteIds={favoriteIds}
            title={title}
            userId={user?.id ?? null}
          />
        </Flex>
      </PageContainer>
    </>
  )
}