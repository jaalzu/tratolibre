'use client'

import { useEffect, useState } from 'react'
import { Box, Circle } from '@chakra-ui/react'
import { Bell } from 'lucide-react'
import NextLink from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface NotificationBellProps {
  initialCount: number
  userId: string
}

export function NotificationBell({ initialCount, userId }: NotificationBellProps) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    const supabase = createClient()

    // Suscripción realtime a notifications del usuario
    const channel = supabase
      .channel('notifications-badge')
      .on(
        'postgres_changes',
        {
          event:  '*',
          schema: 'public',
          table:  'notifications',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          // Re-fetch del count cuando hay cambios
          const { count: newCount } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false)

          setCount(newCount ?? 0)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  return (
    <Box as={NextLink} href="/notifications" position="relative" display="inline-flex" p={1}>
      <Bell size={22} color="var(--chakra-colors-neutral-700)" strokeWidth={1.75} />
      {count > 0 && (
        <Circle
          size="16px"
          bg="feedback.error"
          color="white"
          fontSize="9px"
          fontWeight="bold"
          position="absolute"
          top="-1px"
          right="-1px"
          lineHeight="1"
        >
          {count > 9 ? '9+' : count}
        </Circle>
      )}
    </Box>
  )
}