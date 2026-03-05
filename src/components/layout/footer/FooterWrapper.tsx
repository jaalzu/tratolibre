'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

const EXCLUDED = ['/chat', '/item/new', '/profile/edit']

export const FooterWrapper = () => {
  const pathname = usePathname()
  
  const hide = EXCLUDED.some(path => pathname.startsWith(path)) || 
    pathname.includes('/edit')

  if (hide) return null
  return <Footer />
}