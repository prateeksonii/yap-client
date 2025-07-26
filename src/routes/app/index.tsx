import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sendMessage } from '@/lib/api/contacts'
import { useAppStore } from '@/lib/stores'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  const appStore = useAppStore()

  const { mutate } = useMutation({
    mutationFn: sendMessage,
    mutationKey: ['send_message'],
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const message = formData.get('message') as string
    mutate({
      contactID: appStore.selectedUser?.id ?? 0,
      message,
    })
  }

  return (

    <div className="">
      {appStore.selectedUser
        ? (
            <div className="flex flex-col h-full gap-4">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {appStore.selectedUser.name}
              </h2>
              <div className="flex-1">chat</div>
              <form className="flex items-center gap-3" onSubmit={handleSubmit}>
                <Input name="message" placeholder="Say hi!" className="py-5" />
                <Button className="py-5 flex items-center gap-2">
                  <Send />
                  Send
                </Button>
              </form>
            </div>
          )
        : null}

    </div>
  )
}
