'use client'

import { useState } from 'react'
import { useForm, SubmitHandler, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ItemSchema, ItemInput } from '@/features/items/schemas'
import { createItemAction, updateItemAction } from '@/features/items/actions'
import { Item } from '@/features/items/types'

export const useNewItemForm = (initialData?: Partial<Item>) => {
  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<ItemInput>({
    resolver: zodResolver(ItemSchema) as Resolver<ItemInput>, 
   defaultValues: {
  title:       initialData?.title       ?? '',
  description: initialData?.description ?? '',
  category:    initialData?.category    ?? '',
  condition:   (initialData?.condition as ItemInput['condition']) ?? 'good',
  province:    initialData?.province    ?? '',
  city:        initialData?.city        ?? '',
  images:      initialData?.images      ?? [],
  sale_price:  initialData?.sale_price  ?? undefined,
}
  })

  const handleUpload = async (files: File[]) => {
    setUploading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.fileName || data.url) { 
          const urlToSave = data.url || `/${data.fileName}` 
          setImages(prev => {
            const updated = [...prev, urlToSave]
            setValue('images', updated, { shouldValidate: true })
            return updated
          })
        }
      } catch (err) {
        console.error('Error subiendo imagen:', err)
      }
    }
    setUploading(false)
  }

  const handleRemove = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index)
      setValue('images', updated, { shouldValidate: true })
      return updated
    })
  }

  const onSubmit: SubmitHandler<ItemInput> = async (data) => {
    setServerError(null)
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v))
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })


    if (initialData?.id) {
      formData.append('id', initialData.id)
      const result = await updateItemAction(null, formData)
      if (result?.error) {
        setServerError(typeof result.error === 'string' ? result.error : 'Error en el servidor')
      }
    } else {
      const result = await createItemAction(null, formData)
      if (result?.error) {
        setServerError(typeof result.error === 'string' ? result.error : 'Error en el servidor')
      }
    }
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    images,
    uploading,
    serverError,
    handleUpload,
    handleRemove,
    setValue
  }
}