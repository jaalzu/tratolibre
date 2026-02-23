import { getMyConversations } from '@/features/conversations/actions'
import { createClient } from '@/lib/supabase/server'
import ChatWindow from '@/components/messages/ChatWindow'

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string, type?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const conversations = await getMyConversations()
  const activeConversation = params.conversation
    ? conversations.find((c: any) => c.id === params.conversation)
    : conversations[0]

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mensajes</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-400 text-sm">No tenés conversaciones todavía</p>
      ) : (
        <div className="grid grid-cols-3 gap-6 h-[600px]">

          {/* Lista de conversaciones */}
          <div className="col-span-1 border border-gray-100 rounded-2xl overflow-y-auto">
            {conversations.map((conv: any) => {
              const isBuyer = conv.buyer_id === user?.id
              const other = isBuyer ? conv.seller : conv.buyer
              const isActive = activeConversation?.id === conv.id

              return (
                <a key={conv.id}
                  href={`/dashboard/messages?conversation=${conv.id}`}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors ${isActive ? 'bg-green-50' : ''}`}>
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                    {other?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{other?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{conv.objects?.title}</p>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Chat activo */}
          <div className="col-span-2">
            {activeConversation ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  {activeConversation.objects?.images?.[0] && (
                    <img src={activeConversation.objects.images[0]}
                      className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{activeConversation.objects?.title}</p>
                    <p className="text-xs text-gray-400">${activeConversation.objects?.sale_price?.toLocaleString('es-AR')}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <ChatWindow
                    conversationId={activeConversation.id}
                    userId={user?.id!}
                    type={params.type}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Seleccioná una conversación
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}