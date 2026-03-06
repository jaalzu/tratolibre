'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface SocialButtonsProps {
  showEmail?: boolean
  onEmailClick?: () => void
}

export const SocialButtons = ({ showEmail, onEmailClick }: SocialButtonsProps) => {
  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

//   const handleFacebook = async () => {
//     const supabase = createClient()
//     await supabase.auth.signInWithOAuth({
//       provider: 'facebook',
//       options: { redirectTo: `${window.location.origin}/auth/callback` }
//     })
//   }

  const buttons = [
    { label: 'Continuar con Google', icon: '/svg/google.svg', onClick: handleGoogle },
    // { label: 'Continuar con Facebook', icon: '/svg/facebook.svg', onClick: handleFacebook },
    ...(showEmail && onEmailClick ? [{ label: 'Continuar con email', icon: '/svg/email.svg', onClick: onEmailClick }] : []),
  ]

  const inner = (icon: string, label: string) => (
    <Box display="grid" gridTemplateColumns="28px 1fr" alignItems="center" w="60%" mx="auto">
      <Box w="20px" h="20px" position="relative" justifySelf="center">
        <Image src={icon} alt={label} fill style={{ objectFit: 'contain' }} />
      </Box>
      <Text fontSize="sm" fontWeight="bold" textAlign="left">{label}</Text>
    </Box>
  )

  return (
    <Flex direction="column" gap={3}>
      {buttons.map(({ label, icon, onClick }) => (
        <Button key={label} py={1.5} width="full" variant="secondary" borderRadius="full" onClick={onClick}>
          {inner(icon, label)}
        </Button>
      ))}
    </Flex>
  )
}