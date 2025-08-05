import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface User {
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
  sheetOpen: boolean
  setSheetOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>()(
  devtools(set => ({
    user: null,
    setUser: (user: User) => set(() => ({ user })),
    status: 'offline',
    setStatus: (status: Status) => set(() => ({ status })),
    sheetOpen: false,
    setSheetOpen: (open: boolean) => set(() => ({ sheetOpen: open })),
  })),
)
