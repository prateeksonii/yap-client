import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
}

type Status = 'online' | 'offline'

interface AppStore {
  user: User | null
  setUser: (user: User) => void
  status: Status
  setStatus: (status: Status) => void
  selectedUser: User | null
  setSelectedUser: (user: User) => void
  sheetOpen: boolean
  setSheetOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>()(
  devtools(set => ({
    user: null,
    setUser: (user: User) => set(() => ({ user })),
    status: 'offline',
    setStatus: (status: Status) => set(() => ({ status })),
    selectedUser: null,
    setSelectedUser: (user: User) => set(() => ({ selectedUser: user })),
    sheetOpen: false,
    setSheetOpen: (open: boolean) => set(() => ({ sheetOpen: open })),
  })),
)
