import type { MyRouterContext } from '@/lib/types'
import { createRootRoute, createRootRouteWithContext, isRedirect, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import axios from '@/lib/axios'
import { useAppStore } from '@/lib/stores'

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async (ctx) => {
    const token = localStorage.getItem('yap_token')

    const userStore = useAppStore.getState()

    try {
      const res = await axios.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 200) {
        userStore.setUser(res.data)
        if (ctx.location.href === '/') {
          throw redirect({
            to: '/app',
          })
        }
      }
    }
    catch (err) {
      if (isRedirect(err))
        throw err
      if (ctx.location.href === '/') // avoid infinite redirects
        return
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster />
    </>
  ),
})
