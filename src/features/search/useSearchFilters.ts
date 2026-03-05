'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export interface SearchFilters {
  category:  string
  province:  string
  date:      string
  condition: string
  minPrice:  string
  maxPrice:  string
  orderBy:   string
}

interface Province {
  id:     string
  nombre: string
}

export function useSearchFilters() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [provinces, setProvinces] = useState<Province[]>([])

  const [filters, setFilters] = useState<SearchFilters>({
    category:  searchParams.get('category')  ?? '',
    province:  searchParams.get('province')  ?? '',
    date:      searchParams.get('date')      ?? '',
    condition: searchParams.get('condition') ?? '',
    minPrice:  searchParams.get('min_price') ?? '',
    maxPrice:  searchParams.get('max_price') ?? '',
    orderBy:   searchParams.get('order_by')  ?? 'closest',
  })

  useEffect(() => {
    fetch('https://apis.datos.gob.ar/georef/api/provincias?orden=nombre&campos=id,nombre&max=100')
      .then(r => r.json())
      .then(d => setProvinces(d.provincias ?? []))
  }, [])

  const setFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }))
  }

  const apply = (onClose?: () => void) => {
    const params = new URLSearchParams(searchParams.toString())
    const set = (key: string, val: string) => val ? params.set(key, val) : params.delete(key)
    set('category',  filters.category)
    set('province',  filters.province)
    set('date',      filters.date)
    set('condition', filters.condition)
    set('min_price', filters.minPrice)
    set('max_price', filters.maxPrice)
    set('order_by',  filters.orderBy)
    router.push(`/search?${params.toString()}`)
    onClose?.()
  }

  const clear = (onClose?: () => void) => {
    const params = new URLSearchParams()
    const keywords = searchParams.get('keywords')
    if (keywords) params.set('keywords', keywords)
    setFilters({ category: '', province: '', date: '', condition: '', minPrice: '', maxPrice: '', orderBy: 'closest' })
    router.push(`/search?${params.toString()}`)
    onClose?.()
  }

  const hasFilters = ['category', 'province', 'date', 'condition', 'min_price', 'max_price']
    .some(k => searchParams.has(k))

  return { filters, setFilter, toggleFilter, apply, clear, hasFilters, provinces }
}