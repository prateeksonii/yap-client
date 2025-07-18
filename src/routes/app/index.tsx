import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, Plus, Search, Send } from 'lucide-react'
import { useState } from 'react'
import AddContact from '@/components/add-contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { createContact, getUserContacts } from '@/lib/api/contacts'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [open, setOpen] = useState(false)

  const { data: contacts, refetch } = useQuery({
    queryFn: getUserContacts,
    queryKey: ['user_contacts'],
    initialData: [],
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createContact,
    mutationKey: ['create_contact'],
  })

  const onUserSelected = async (user: any) => {
    setOpen(false)

    await mutateAsync(user)
    refetch()
  }

  return (
    <div className="mx-auto h-screen container py-8">
      <div className="h-full grid grid-cols-[300px_auto] gap-8">
        <div>
          <h4 className="text-2xl">Hop</h4>
          <div className="flex items-center justify-between">
            <div className="text-lg">Recent chats</div>
            <Sheet open={open} onOpenChange={setOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="ghost">
                      <Plus />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add New Contact</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent>
                <AddContact onUserSelected={onUserSelected} />
              </SheetContent>
            </Sheet>
          </div>
          {!isPending && contacts && (
            <div
              className="py-4 text-lg border-b border-b-foreground cursor-pointer"
            >
              {contacts[0]?.alias}
            </div>
          )}
        </div>
        <div className="flex flex-col h-full">
          <div className="flex-1">chat</div>
          <div className="flex items-center gap-3">
            <Input placeholder="Say hi!" className="py-5" />
            <Button className="py-5 flex items-center gap-2">
              <Send />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
