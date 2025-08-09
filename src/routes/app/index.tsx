import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import AddContact from '@/components/add-contact'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAppStore } from '@/lib/stores'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  const appStore = useAppStore()
  return (
    <main className="grid h-full place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center text-3xl text-muted-foreground">
          Select a chat to start messaging
        </div>
        <Sheet open={appStore.sheetOpen} onOpenChange={appStore.setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </SheetTrigger>
          <SheetContent>
            <AddContact />
          </SheetContent>
        </Sheet>
      </div>
    </main>
  )
}
