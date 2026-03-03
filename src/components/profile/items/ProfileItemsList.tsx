// import { Stack, Text, Flex, Box } from '@chakra-ui/react'
// import { ProfileItemCard } from './ProfileItemCard'

// interface ProfileItemsListProps {
//   items: any[]
//   emptyMessage?: string
// }

// export const ProfileItemsList = ({ items, emptyMessage = 'No hay publicaciones' }: ProfileItemsListProps) => {
//   if (!items.length) return (
//     <Flex direction="column" align="center" py={8} gap={2}>
//       <Text fontSize="2xl">📦</Text>
//       <Text fontSize="sm" color="neutral.400">{emptyMessage}</Text>
//     </Flex>
//   )

//   return (
//     <Stack gap={2}>
//       {items.map(item => (
//         <ProfileItemCard key={item.id} item={item}  />
//       ))}
//     </Stack>
//   )
// }