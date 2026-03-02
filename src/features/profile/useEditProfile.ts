'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { updateProfileAction } from './actions'

export function useEditProfile() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateProfileAction(formData)
      if (result?.error) console.error(result.error)
    })
  }

  return { handleSubmit, isPending }
}