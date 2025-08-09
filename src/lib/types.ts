import type { QueryClient } from '@tanstack/react-query'

export interface MyRouterContext {
  queryClient: QueryClient
}

export interface Chat {
  chatId: number
  contactId: number
  contactName: string
  lastMessage: string
  lastMessageAt: Date
  isOnline?: boolean
}
