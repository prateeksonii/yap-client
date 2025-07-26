import { createFileRoute, Outlet } from '@tanstack/react-router'
import Sidebar from '@/components/sidebar'
import { useAppStore } from '@/lib/stores'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
  loader: async () => {
    const params = new URLSearchParams()
    params.set('token', `Bearer ${localStorage.getItem('yap_token')!}`)
    const ws = new WebSocket(`ws://localhost:8000/ws?${params}`)

    const appStore = useAppStore.getState()

    ws.addEventListener('open', () => {
      appStore.setStatus('online')
    })

    ws.addEventListener('close', () => {
      appStore.setStatus('offline')
    })
  },
})

function RouteComponent() {
  return (
    <div>
      <div className="mx-auto h-screen container py-8">
        <div className="h-full grid grid-cols-[300px_auto] gap-8">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
