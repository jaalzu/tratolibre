'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toggleFavoriteAction } from '@/features/items/actions'

export const useFavorite = (itemId: string, initialFavorited: boolean, userId: string | null) => {
  const [favorited, setFavorited] = useState(initialFavorited)
  const router = useRouter()

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userId) return router.push('/login')
    
    setFavorited(prev => !prev) // instantáneo
    const result = await toggleFavoriteAction(itemId)
    if (result?.error) setFavorited(prev => !prev) // revertir si falla
  }

  return { favorited, toggle }
}