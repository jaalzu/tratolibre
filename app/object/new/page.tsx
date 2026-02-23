'use client'

import { useActionState, useState } from 'react'
import { createObjectAction } from '@/features/objects/actions'
import { CATEGORIES, CONDITIONS } from '@/features/objects/utils'

export default function NewObjectPage() {
  const [state, formAction] = useActionState<any, FormData>(createObjectAction, null)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setImages(prev => [...prev, data.url])
    }
    setUploading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Publicar objeto</h1>
      <p className="text-gray-500 text-sm mb-8">Completá los datos de tu objeto</p>

      <form action={formAction} className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input name="title" type="text" placeholder="Ej: iPhone 13 Pro 256GB"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
          {state?.error?.fieldErrors?.title && <p className="text-red-500 text-xs mt-1">{state.error.fieldErrors.title[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="description" rows={4} placeholder="Describí el objeto, su estado, qué incluye..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
          {state?.error?.fieldErrors?.description && <p className="text-red-500 text-xs mt-1">{state.error.fieldErrors.description[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select name="category"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500">
            <option value="">Elegí una categoría</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
          {state?.error?.fieldErrors?.category && <p className="text-red-500 text-xs mt-1">{state.error.fieldErrors.category[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
          <input name="sale_price" type="number" min="0" placeholder="0"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
          {state?.error?.fieldErrors?.sale_price && <p className="text-red-500 text-xs mt-1">{state.error.fieldErrors.sale_price[0]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barrio / Zona</label>
            <input name="location" type="text" placeholder="Ej: Palermo"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input name="city" type="text" placeholder="Ej: Buenos Aires"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado del objeto</label>
          <select name="condition"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500">
            {CONDITIONS.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condiciones <span className="text-gray-400">(opcional)</span>
          </label>
          <textarea name="rules" rows={2} placeholder="Ej: Solo vendo en mano, no envíos..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fotos</label>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
          {uploading && <p className="text-sm text-gray-400 mt-1">Subiendo fotos...</p>}
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((url, i) => (
                <img key={i} src={url} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
              ))}
            </div>
          )}
          {images.map(url => (
            <input key={url} type="hidden" name="images" value={url} />
          ))}
          {state?.error?.fieldErrors?.images && <p className="text-red-500 text-xs mt-1">{state.error.fieldErrors.images[0]}</p>}
        </div>

        {state?.error && typeof state.error === 'string' && (
          <p className="text-red-500 text-sm">{state.error}</p>
        )}

        <button type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg text-sm transition-colors">
          Publicar
        </button>
      </form>
    </div>
  )
}