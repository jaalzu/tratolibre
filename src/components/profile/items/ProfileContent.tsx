// 'use client'

// import { useState } from 'react'
// import { Box, Flex, Text, SimpleGrid } from '@chakra-ui/react'
// import { ProfileItemCard } from './ProfileItemCard'

// interface ProfileContentProps {
//   forSale: any[]
//   sold: any[]
// }

// export const ProfileContent = ({ forSale, sold }: ProfileContentProps) => {
//   const [tab, setTab] = useState<'sale' | 'sold'>('sale')
//   const items = tab === 'sale' ? forSale : sold

//   return (
//     <Box>
//       {/* Tabs */}
//       <Flex justify="center" gap={8} mb={6}>
//         <Box textAlign="center" cursor="pointer" onClick={() => setTab('sale')}>
//           <Text
//             fontSize="lg"
//             fontWeight="bold"
//             color={tab === 'sale' ? 'neutral.900' : 'neutral.400'}
//             transition="all 0.2s"
//           >
//             {forSale.length}
//           </Text>
//           <Text
//             fontSize="sm"
//             fontWeight={tab === 'sale' ? 'bold' : 'normal'}
//             color={tab === 'sale' ? 'neutral.900' : 'neutral.400'}
//             borderBottom={tab === 'sale' ? '2px solid' : 'none'}
//             borderColor="neutral.900"
//             pb={0.5}
//             transition="all 0.2s"
//           >
//             En venta
//           </Text>
//         </Box>

//         <Box textAlign="center" cursor="pointer" onClick={() => setTab('sold')}>
//           <Text
//             fontSize="lg"
//             fontWeight="bold"
//             color={tab === 'sold' ? 'neutral.900' : 'neutral.400'}
//             transition="all 0.2s"
//           >
//             {sold.length}
//           </Text>
//           <Text
//             fontSize="sm"
//             fontWeight={tab === 'sold' ? 'bold' : 'normal'}
//             color={tab === 'sold' ? 'neutral.900' : 'neutral.400'}
//             borderBottom={tab === 'sold' ? '2px solid' : 'none'}
//             borderColor="neutral.900"
//             pb={0.5}
//             transition="all 0.2s"
//           >
//             Vendidos
//           </Text>
//         </Box>
//       </Flex>

//       {/* Grilla */}
//       {items.length === 0 ? (
//         <Flex direction="column" align="center" py={12} gap={2}>
//           <Text fontSize="2xl">📦</Text>
//           <Text fontSize="sm" color="neutral.400">
//             {tab === 'sale' ? 'No tiene publicaciones activas' : 'No tiene ventas todavía'}
//           </Text>
//         </Flex>
//       ) : (
//         <SimpleGrid columns={3} gap={2}>
//           {items.map(item => (
//             <ProfileItemCard key={item.id} item={item} />
//           ))}
//         </SimpleGrid>
//       )}
//     </Box>
//   )
// }