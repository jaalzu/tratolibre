'use client'

import { useUnreadCount } from '@/features/chat/hooks/useUnreadCount'
import NavLink from './NavLink'

interface ChatNavLinkProps {
  userId?: string
  variant?: 'desktop' | 'mobile'
}

export const ChatNavLink = ({ userId, variant = 'desktop' }: ChatNavLinkProps) => {
  const unread = useUnreadCount(userId)
  return <NavLink href="/chat" label="Buzón" icon="bx-message-square-dots" variant={variant} badge={unread} />
}