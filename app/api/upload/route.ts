import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string || 'item-images'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const filename = `${user.id}/${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, { contentType: file.type, upsert: false })

    console.log('bucket recibido:', bucket)
console.log('error:', error)

 if (error) {
  console.log('Supabase error:', error)
  return NextResponse.json({ error: error.message }, { status: 500 })
}

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}