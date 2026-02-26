'use client'

import { useEffect, useState } from 'react'
import { getMyConversations } from '@/features/chat/actions'
import NavLink from './NavLink'

export const ChatNavLink = () => {
  const [href, setHref] = useState('/chat')

  useEffect(() => {
    getMyConversations().then(convs => {
      if (convs.length > 0) setHref(`/chat/${convs[0].id}`)
    })
  }, [])

  return <NavLink href={href} label="Buzón" icon="bx-message-square-dots" variant="desktop" />
}