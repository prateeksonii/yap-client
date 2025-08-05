
import { createFileRoute } from '@tanstack/react-router'
import Chat from '@/components/chat'

export const Route = createFileRoute('/app/$chatId')({
  component: Chat,
})
