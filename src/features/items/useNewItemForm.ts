'use client'

import { useState } from 'react'
import { useForm, SubmitHandler, Resolver } from 'react-hook-form' // Importamos Resolver
import { zodResolver } from '@hookform/resolvers/zod'
import { ItemSchema, ItemInput } from '@/features/items/schemas'
import { createItemAction } from '@/features/items/actions'

export const useNewItemForm = () => {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Forzamos el resolver para que coincida exactamente con ItemInput
  // Esto quita el error de "sale_price: unknown" vs "number"
  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<ItemInput>({
    resolver: zodResolver(ItemSchema) as Resolver<ItemInput>, 
    defaultValues: {
      title: '',
      description: '',
      category: '',
      condition: 'good',
      province: '',
      images: [],
      // No inicializamos sale_price aquí para evitar conflictos con coerce
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
        // Importante: Guardamos solo el nombre del archivo
        if (data.fileName || data.url) { 
          const nameToSave = data.fileName || data.url.split('/').pop()
          setImages(prev => {
            const updated = [...prev, nameToSave]
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

    const result = await createItemAction(null, formData)
    if (result?.error) {
      setServerError(typeof result.error === 'string' ? result.error : 'Error en el servidor')
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