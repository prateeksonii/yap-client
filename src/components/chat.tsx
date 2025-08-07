import type { Message } from '@/lib/api/messages'
import type { User } from '@/lib/stores'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Send } from 'lucide-react'
import { sendMessage } from '@/lib/api/contacts'
import axios from '@/lib/axios'
import { cn } from '@/lib/utils'
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
  const chatId = Number(params?.chatId)

  // Fetch chat info to get contactId, name, etc.
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

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col h-full gap-4">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {user.name}
        </h2>
        <div className="flex-1 flex flex-col gap-1 justify-end">
          {
            messages?.map((message, index) => (
              <div key={message.id}>
                {(index === 0 || message.senderId !== messages[index - 1].senderId)
                  ? message.senderId === userId
                    ? <div className="text-left text-xs text-muted-foreground">{user.name}</div>
                    : <div className="text-right text-xs text-muted-foreground">You</div>
                  : null}
                <div className={cn('flex items-center gap-3', message.senderId === userId ? '' : 'flex-row-reverse')}>
                  <div
                    className={cn(
                      'bg-blue-500 text-white py-1 rounded-md w-max px-4',
                    )}
                  >
                    {message.content}
                  </div>
                  <span className="text-xs">{format(message.createdAt, 'HH:mm')}</span>
                </div>
              </div>
            ))
          }
        </div>
        <form className="flex items-center gap-3" onSubmit={handleSubmit}>
          <Input name="message" placeholder="Say hi!" className="py-5" />
          <Button className="py-5 flex items-center gap-2">
            <Send />
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
