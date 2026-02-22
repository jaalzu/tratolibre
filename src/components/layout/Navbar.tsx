import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/features/auth/actions'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-green-600">
          TratoLibre
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-sm text-gray-600 hover:text-gray-900">
            Explorar
          </Link>

          {user ? (
            <>
              <Link href="/object/new"
                className="text-sm text-gray-600 hover:text-gray-900">
                Publicar
              </Link>
              <Link href="/dashboard/messages" className="text-sm text-gray-600 hover:text-gray-900">
                Mensajes
                </Link>
              <Link href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <form action={logoutAction}>
                <button type="submit"
                  className="text-sm text-red-500 hover:text-red-600">
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-sm text-gray-600 hover:text-gray-900">
                Iniciar sesión
              </Link>
              <Link href="/register"
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}