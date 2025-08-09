import type { Message } from '@/lib/api/messages'
import type { User } from '@/lib/stores'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Send } from 'lucide-react'
import React from 'react'
import { sendMessage } from '@/lib/api/contacts'
import axios from '@/lib/axios'
import { useAppStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Input } from './ui/input'

async function getUserById(id: number): Promise<User> {
  const res = await axios.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
    },
  })

  return res.data
}

async function getChatMessages(chatId: number): Promise<Message[]> {
  const res = await axios.get(`/messages`, {
    params: {
      chat_id: chatId,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
    },
  })

  return res.data
}

export default function Chat() {
  const params = useParams({ from: '/app/$chatId' })
  const {
    user: currentUser,
    setActiveContact,
    setActiveChatId,
    removeUnreadChat,
  } = useAppStore()
  const chatId = Number(params?.chatId)

  const { data: chats = [] } = useQuery({
    queryFn: async () => {
      const res = await axios.get('/chats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
        },
      })
      return res.data
    },
    queryKey: ['user_chats'],
  })

  const chat = chats?.find((c: any) => c.chatId === chatId)
  const userId = chat?.contactId

  const { mutate } = useMutation({
    mutationFn: sendMessage,
    mutationKey: ['send_message'],
  })

  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useQuery({
    queryFn: () => getUserById(userId!),
    queryKey: ['user_by_id', userId],
    enabled: !!userId,
  })

  const userOnlineStatus = chat?.isOnline ?? user?.isOnline

  React.useEffect(() => {
    if (user?.name) {
      setActiveContact({ name: user.name, isOnline: userOnlineStatus })
      setActiveChatId(chatId)
      removeUnreadChat(chatId)
    }

    return () => {
      setActiveContact(null)
      setActiveChatId(null)
    }
  }, [user?.name, userOnlineStatus, setActiveContact, chatId, setActiveChatId, removeUnreadChat])

  const { data: messages, isLoading: isLoadingMessages, isError: isErrorMessages }
    = useQuery({
      queryFn: () => getChatMessages(chatId!),
      queryKey: ['chat_messages', chatId],
      enabled: !!chatId,
    })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const message = formData.get('message') as string
    mutate({
      contactID: userId ?? 0,
      message,
    })
    event.currentTarget.reset()
  }

  if (isLoadingUser || isLoadingMessages) {
    return <div>Loading...</div>
  }

  if (!userId || !chatId) {
    return <div>Open a chat</div>
  }

  if (isErrorUser || !user || isErrorMessages) {
    return <div>Error</div>
  }

  const ChatForm = () => (
    <footer className="border-t p-4">
      <form className="flex items-center gap-3" onSubmit={handleSubmit}>
        <Input name="message" placeholder="Type a message..." className="py-5" />
        <Button className="flex items-center gap-2 py-5">
          <Send />
          Send
        </Button>
      </form>
    </footer>
  )

  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full flex-col bg-background text-foreground">
        <main className="grid flex-1 place-items-center">
          <div className="text-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        </main>
        <ChatForm />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <main className="flex flex-1 flex-col-reverse space-y-4 space-y-reverse overflow-y-auto p-4">
        {messages?.slice().reverse().map((message) => {
          const isMe = message.senderId !== userId
          return (
            <div key={message.id} className={cn('flex items-start gap-3', isMe ? 'flex-row-reverse' : '')}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{(isMe ? currentUser?.name : user.name)?.[0]}</AvatarFallback>
              </Avatar>
              <div className={cn('flex flex-col gap-1', isMe ? 'items-end' : 'items-start')}>
                <div
                  className={cn(
                    'max-w-xs rounded-xl p-2 px-3',
                    isMe
                      ? 'rounded-br-none bg-primary text-primary-foreground'
                      : 'rounded-bl-none bg-muted text-muted-foreground',
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground">{format(message.createdAt, 'HH:mm')}</span>
              </div>
            </div>
          )
        })}
      </main>
      <ChatForm />
    </div>
  )
}
