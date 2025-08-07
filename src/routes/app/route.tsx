import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
// import Sidebar from '@/components/sidebar'
import { useAppStore } from '@/lib/stores'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
  loader: async (ctx) => {
    const params = new URLSearchParams()
    params.set('token', `Bearer ${localStorage.getItem('yap_token')!}`)
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?${params}`)

    const appStore = useAppStore.getState()

    ws.addEventListener('open', () => {
      appStore.setStatus('online')
    })

    ws.addEventListener('close', () => {
      appStore.setStatus('offline')
    })

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      ctx.context.queryClient.fetchQuery({
        queryKey: ['chat_messages', data.chat_id],
      })
    })
  },
})

function RouteComponent() {
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
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
