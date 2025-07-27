import { createFileRoute } from '@tanstack/react-router'
import Chat from '@/components/chat'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Chat />
  )
}
