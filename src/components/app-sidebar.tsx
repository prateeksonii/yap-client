import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { formatDistanceToNow } from 'date-fns'
import { Command, Inbox, Plus } from 'lucide-react'
import * as React from 'react'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { getUserChats } from '@/lib/api/chats'
import { useAppStore } from '@/lib/stores'
import type { Chat } from '@/lib/types'
import AddContact from './add-contact'
import { OnlineStatus } from './online-status'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

// This is sample data
const data = {
  navMain: [
    {
      title: 'Inbox',
      url: '#',
      icon: Inbox,
      isActive: true,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const appStore = useAppStore()

  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const { setOpen } = useSidebar()

  const { data: chats } = useQuery({
    queryFn: getUserChats,
    queryKey: ['user_chats'],
    initialData: [],
  }) as { data: Chat[] }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="hidden md:flex w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link to="/app">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        // const mail = data.mails.sort(() => Math.random() - 0.5)
                        // setMails(
                        //   mail.slice(
                        //     0,
                        //     Math.max(5, Math.floor(Math.random() * 10) + 1),
                        //   ),
                        // )
                        setOpen(true)
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {appStore.user && <NavUser user={appStore.user} />}
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-foreground text-base font-medium">
                Chats
              </div>
              <OnlineStatus isOnline={appStore.status === 'online'} size="sm" showLabel />
            </div>
            <Sheet open={appStore.sheetOpen} onOpenChange={appStore.setSheetOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
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
            {/* <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label> */}
          </div>
          {/* <SidebarInput placeholder="Type to search..." /> */}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {chats.map((chat) => (
                <Link
                  to="/app/$chatId"
                  params={{
                    chatId: chat.chatId.toString(),
                  }}
                  viewTransition={true}
                  key={chat.chatId}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-ellipsis text-base">{chat.contactName}</span>
                      <OnlineStatus isOnline={chat.isOnline} size="sm" />
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {chat.lastMessageAt && formatDistanceToNow(chat.lastMessageAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <span className="line-clamp-1 text-ellipsis w-[260px] text-sm whitespace-break-spaces">
                    {chat.lastMessage}
                  </span>
                </Link>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
