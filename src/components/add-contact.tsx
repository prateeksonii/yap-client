import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import axios from '@/lib/axios'
import { useAppStore } from '@/lib/stores'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { OnlineStatus } from './online-status'
import { Separator } from './ui/separator'
import { SheetHeader, SheetTitle } from './ui/sheet'
import { Skeleton } from './ui/skeleton'

async function getUsersByQuery(query: string) {
  const res = await axios.get(`/users/search`, {
    params: {
      q: query,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
    },
  })

  return res.data
}

async function createChat(contactId: number) {
  const res = await axios.post('/chats', {
    contactId,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
    },
  })

  return res.data
}

export default function AddContact() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const debouncedInput = useDebouncedValue(query, 500)
  const appStore = useAppStore()

  const { data, error, isLoading } = useQuery({
    queryFn: () => getUsersByQuery(debouncedInput),
    queryKey: ['search', debouncedInput],
    staleTime: 5000 * 60,
    enabled: !!debouncedInput,
  })

  const { mutateAsync } = useMutation({
    mutationFn: createChat,
    mutationKey: ['create_chat'],
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['user_chats'],
      })
    },
  })

  const onUserSelected = async (user: any) => {
    await mutateAsync(user.id)
    appStore.setSheetOpen(false)
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>Add New Contact</SheetTitle>
      </SheetHeader>

      <div className="px-4">
        <form>
          <div className="relative">
            <Search
              className="absolute left-2 top-1/2 bottom-1/2 -translate-y-1/2 w-5"
            />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by email"
              className="pl-8 pr-2"
            />
          </div>
        </form>

        {isLoading && <Skeleton className="h-[40px] w-full rounded-full" />}

        {error && <div>Errorrrr</div>}

        {!isLoading && !!debouncedInput && !data && <div>No results found</div>}

        {!isLoading && !!debouncedInput && data && data.map((user: any) => (
          <React.Fragment key={user.id}>
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="scroll-m-20 text-lg font-semibold tracking-tight">{user.name}</div>
                  <OnlineStatus isOnline={user.isOnline} size="sm" />
                </div>
                <div className="text-muted-foreground text-sm">{user.email}</div>
              </div>
              <div>
                <Button size="sm" onClick={() => onUserSelected(user)}>Select</Button>
              </div>
            </div>
            <Separator />
          </React.Fragment>
        ))}
      </div>

    </>
  )
}
