import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useAppStore } from '@/lib/stores'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { SheetHeader, SheetTitle } from './ui/sheet'
import { Skeleton } from './ui/skeleton'

async function getUsersByQuery(query: string) {
  const res = await axios.get('http://localhost:8000/api/v1/users/search', {
    params: {
      q: query,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
    },
  })

  return res.data
}

export default function AddContact() {
  const [query, setQuery] = useState('')
  const debouncedInput = useDebouncedValue(query, 500)
  const appStore = useAppStore()

  const { data, error, isLoading } = useQuery({
    queryFn: () => getUsersByQuery(debouncedInput),
    queryKey: ['search', debouncedInput],
    staleTime: 5000 * 60,
    enabled: !!debouncedInput,
  })

  const onUserSelected = (user: any) => {
    appStore.setSelectedUser(user)
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
              <div>
                <div className="scroll-m-20 text-lg font-semibold tracking-tight">{user.name}</div>
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
