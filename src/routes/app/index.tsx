import { createFileRoute } from '@tanstack/react-router'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto h-screen container py-8">
      <div className="h-full grid grid-cols-[300px_auto] gap-8">
        <div>
          <h4 className="text-2xl">Hop</h4>
          <div className="flex items-center justify-between">
            <div className="text-lg">Recent chats</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost"><Edit /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>New Contact</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col h-full">
          <div className="flex-1">chat</div>
          <div>text</div>
        </div>
      </div>
    </div>
  )
}
