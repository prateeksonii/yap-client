import { createRootRoute, isRedirect, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import axios from '@/lib/axios'

export const Route = createRootRoute({
  beforeLoad: async (ctx) => {
    const token = localStorage.getItem('yap_token')

    try {
      const res = await axios.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 200) {
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
