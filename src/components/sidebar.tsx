import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { LogOut, Plus } from 'lucide-react'
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
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem('yap_token')
    router.navigate({ to: '/' })
  }

  const { data: chats } = useQuery({
    queryFn: getUserChats,
    queryKey: ['user_chats'],
    initialData: [],
  })

  return (
    <div className="shadow-lg px-4 h-full flex flex-col">
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
      <div className="flex items-center justify-between mt-4">
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
      <div className="flex-1 overflow-y-auto mt-2">
        {chats?.map((chat: any) => (
          <div
            key={chat.chatId}
            className="py-4 text-lg cursor-pointer"
            onClick={() => router.navigate({ to: `/app/${chat.chatId}` })}
          >
            <Separator className="mb-3" />
            {chat.contactName}
            <Separator className="mt-3" />
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 py-5 text-red-500 hover:bg-red-500 hover:text-white border border-red-500"
          style={{ justifyContent: 'center' }}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
