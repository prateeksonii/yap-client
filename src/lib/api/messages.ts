export interface Message {
  id: number
  content: string
  senderId: number
  chatId: number
  createdAt: Date
  isOnline?: boolean
}
