import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import React from 'react'
import { getUserChats } from '@/lib/api/chats'
import { useAppStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import AddContact from './add-contact'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export default function Sidebar() {
  const appStore = useAppStore()

  const { data: chats } = useQuery({
    queryFn: getUserChats,
    queryKey: ['user_chats'],
    initialData: [],
  })

  return (
    <div className="shadow-lg p-4">
      <h4 className="text-xl">
        <div className="text-sm text-muted-foreground">Welcome,</div>
        <div className="flex items-center gap-3">

          {appStore.user?.name}
          <Badge variant="outline" className="capitalize">
            <>
              <div className={cn(
                'w-3 h-3 rounded-full',
                appStore.status === 'offline' ? 'bg-red-400' : 'bg-green-400',
              )}
              >
              </div>
              {appStore.status}
            </>
          </Badge>
        </div>

      </h4>
      <div className="flex items-center justify-between">
        <div className="text-lg text-muted-foreground">Recent chats</div>
        <Sheet open={appStore.sheetOpen} onOpenChange={appStore.setSheetOpen}>
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
            <AddContact />
          </SheetContent>
        </Sheet>
      </div>
      {appStore.selectedUser && (
        <div
          className="py-4 text-lg cursor-pointer"
        >
          <Separator className="mb-3" />
          {appStore.selectedUser.name}
          <Separator className="mt-3" />
        </div>
      )}
      {/* // eslint-disable-next-line react/no-children-to-array */}
      {React.Children.toArray(
        chats.map((chat: any) => (
          <div
            className="py-4 text-lg cursor-pointer"
          >
            <Separator className="mb-3" />
            {chat.contactName}
            <Separator className="mt-3" />
          </div>
        )),
      )}
    </div>
  )
}
