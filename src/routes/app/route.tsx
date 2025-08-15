import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { OnlineStatus } from '@/components/online-status'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
// import Sidebar from '@/components/sidebar'
import { useAppStore } from '@/lib/stores'
import type { QueryClient } from '@tanstack/react-query'

// Function to handle online status updates
function handleOnlineStatusUpdate(queryClient: QueryClient, data: any) {
  const isOnline = data.type === 'user_online'
  const userId = data.userId
  const userName = data.userName
  

  // Validate required data
  if (!userId) {
    console.error('Missing userId in online status update:', data)
    return
  }

  console.log(`User ${userName || userId} (${userId}) is now ${isOnline ? 'online' : 'offline'}`)

  // Update the user chats query to reflect the new online status
  queryClient.setQueryData(['user_chats'], (oldData: any) => {
    if (!oldData) return oldData

    return oldData.map((chat: any) => {
      // Check if this chat is with the user whose status changed
      if (chat.contactId === userId) {
        return {
          ...chat,
          isOnline: isOnline
        }
      }
      return chat
    })
  })

  // Also update any individual user queries that might be cached
  queryClient.setQueryData(['user_by_id', userId], (oldData: any) => {
    if (!oldData) return oldData

    return {
      ...oldData,
      isOnline: isOnline
    }
  })
}

export const Route = createFileRoute('/app')({
  component: RouteComponent,
  loader: async (ctx) => {
    const params = new URLSearchParams()
    params.set('token', `Bearer ${localStorage.getItem('yap_token')!}`)
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?${params}`)

    const appStore = useAppStore.getState()

    // Store the WebSocket connection globally
    appStore.setWs(ws)

    ws.addEventListener('open', () => {
      console.log('WebSocket connected')
      appStore.setStatus('online')
    })

    ws.addEventListener('close', () => {
      console.log('WebSocket disconnected')
      appStore.setStatus('offline')
      appStore.setWs(null)
    })

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error)
      appStore.setStatus('offline')
      appStore.setWs(null)
    })

    ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data)
        const appStore = useAppStore.getState()

        // Handle different message types
        switch (data.type) {
          case 'new_message':
            // If the message is not from the current user and not for the currently open chat,
            // mark it as unread.
            if (data.sender_id !== appStore.user?.id && data.chat_id !== appStore.activeChatId) {
              appStore.addUnreadChat(data.chat_id)
            }

            // Optimistically update the chat list
            ctx.context.queryClient.setQueryData(['user_chats'], (oldData: any[] | undefined) => {
              if (!oldData) return []

              const chatIndex = oldData.findIndex(chat => chat.chatId === data.chat_id)

              if (chatIndex === -1) {
                // If chat is not in the list, refetch the list to get the new chat.
                ctx.context.queryClient.refetchQueries({ queryKey: ['user_chats'] })
                return oldData
              }

              const updatedChat = {
                ...oldData[chatIndex],
                lastMessage: data.content,
                lastMessageAt: data.created_at,
              }

              // Remove the updated chat from its old position and add it to the top.
              const newData = oldData.filter(chat => chat.chatId !== data.chat_id)
              newData.unshift(updatedChat)

              return newData
            })

            // Refetch messages for the chat that received the new message
            ctx.context.queryClient.fetchQuery({
              queryKey: ['chat_messages', data.chat_id],
            })
            break

          case 'user_online':
          case 'user_offline':
            handleOnlineStatusUpdate(ctx.context.queryClient, data)
            break

          default:
            // Handle legacy message format (no type field)
            if (data.chat_id) {
              ctx.context.queryClient.fetchQuery({
                queryKey: ['chat_messages', data.chat_id],
              })
            }
            break
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error)
      }
    })

    // Handle page unload to send logout event
    const handleBeforeUnload = () => {
      try {
        ws.send(JSON.stringify({ type: 'logout' }))
      } catch (error) {
        console.error('Error sending logout event on page unload:', error)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  },
})

function RouteComponent() {
  const { activeContact } = useAppStore()
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '350px',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="h-16 px-4 bg-background flex items-center gap-2 border-b">
          <SidebarTrigger className="-ml-1" />
          {activeContact && (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{activeContact.name}</h2>
              <OnlineStatus isOnline={activeContact.isOnline} showLabel />
            </div>
          )}
        </header>
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
