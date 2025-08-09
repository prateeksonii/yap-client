import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface User {
  id: number
  name: string
  email: string
  isOnline?: boolean
}

type Status = 'online' | 'offline'

interface AppStore {
  user: User | null
  setUser: (user: User) => void
  status: Status
  setStatus: (status: Status) => void
  sheetOpen: boolean
  setSheetOpen: (open: boolean) => void
  ws: WebSocket | null
  setWs: (ws: WebSocket | null) => void
  closeWs: () => void
  sendWsMessage: (message: any) => void
}

export const useAppStore = create<AppStore>()(
  devtools(set => ({
    user: null,
    setUser: (user: User) => set(() => ({ user })),
    status: 'offline',
    setStatus: (status: Status) => set(() => ({ status })),
    sheetOpen: false,
    setSheetOpen: (open: boolean) => set(() => ({ sheetOpen: open })),
    ws: null,
    setWs: (ws: WebSocket | null) => set(() => ({ ws })),
    closeWs: () => set((state) => {
      if (state.ws) {
        // Send logout event before closing
        try {
          state.ws.send(JSON.stringify({ type: 'logout' }))
        } catch (error) {
          console.error('Error sending logout event:', error)
        }
        
        // Close the connection
        state.ws.close()
      }
      return { ws: null, status: 'offline' }
    }),
    sendWsMessage: (message: any) => set((state) => {
      if (state.ws && state.ws.readyState === WebSocket.OPEN) {
        try {
          state.ws.send(JSON.stringify(message))
        } catch (error) {
          console.error('Error sending WebSocket message:', error)
        }
      } else {
        console.warn('WebSocket is not connected')
      }
      return state
    }),
  })),
)
