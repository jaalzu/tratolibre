import { redirect } from 'next/navigation'
import { CATEGORIES } from '@/lib/constants'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const exists = CATEGORIES.some(c => c.id === slug)
  if (!exists) redirect('/')
  redirect(`/search?category=${slug}`)
}