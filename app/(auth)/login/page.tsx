'use client'

import { loginAction } from '@/features/auth/actions'
import { useActionState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
const [state, formAction] = useActionState<any, FormData>(loginAction, null)

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Bienvenido</h1>
      <p className="text-gray-500 text-sm mb-6">Iniciá sesión en TratoLibre</p>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder="tu@email.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
          {state?.error?.email && <p className="text-red-500 text-xs mt-1">{state.error.email[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="Tu contraseña"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
          {state?.error?.password && <p className="text-red-500 text-xs mt-1">{state.error.password[0]}</p>}
        </div>

        {state?.error?._form && (
          <p className="text-red-500 text-sm">{state.error._form[0]}</p>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg text-sm transition-colors"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿No tenés cuenta?{' '}
        <Link href="/register" className="text-green-600 font-medium hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  )
}