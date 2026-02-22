'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RegisterSchema, LoginSchema } from './schemas'

export async function registerAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()

  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = RegisterSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { name, email, password } = parsed.data

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })

  if (error) return { error: { _form: [error.message] } }
  redirect('/dashboard')
}

export async function loginAction(_prevState: any, formData: FormData) {
  const supabase = await createClient()

  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = LoginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { email, password } = parsed.data

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: { _form: [error.message] } }
  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}