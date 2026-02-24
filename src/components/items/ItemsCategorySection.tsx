import NextLink from 'next/link'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { ItemCard } from '@/components/items/ItemCard'

interface ItemsRowProps {
  title: string
  items: any[]
  viewMoreHref?: string
  viewMoreLabel?: string
}

export const ItemsCategorySection  = ({ title, items, viewMoreHref, viewMoreLabel = 'Ver más' }: ItemsRowProps) => {
  if (!items.length) return null

  return (
    <PageContainer pt={{ base: 4, md: 8 }} pb={12} px={{ base: 4, md: 24 }}>
      <Flex align="center" justify="space-between" mb={6}>
        <Heading as="h2" fontSize="lg" fontWeight="bold" color="neutral.900">
          {title}
        </Heading>
        {viewMoreHref && (
          <NextLink href={viewMoreHref} style={{ textDecoration: 'none' }}>
            <Text fontSize="sm" fontWeight="bold" color="accent.default" _hover={{ color: 'accent.hover' }}>
              {viewMoreLabel}
            </Text>
          </NextLink>
        )}
      </Flex>

      <Box
        overflowX="auto"
        css={{
          '&::-webkit-scrollbar': { height: '6px' },
          '&::-webkit-scrollbar-thumb': { borderRadius: '100px', background: '#c1c1c1' },
        }}
      >
        <Grid
          templateColumns="repeat(13, 176px)"
          style={{ gap: '20px' }}
        >
          {items.map((obj: any) => (
            <ItemCard key={obj.id} obj={obj} />
          ))}
        </Grid>
      </Box>
    </PageContainer>
  )
}