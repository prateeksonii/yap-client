import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
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
        // ctx.context.user = res.data;

        if (ctx.location.href === '/') {
          throw redirect({
            to: '/app',
          })
        }
      }
    }
    catch {
      if (ctx.location.href === '/')
        return
      throw redirect({
        // search: {
        //   redirect: ctx.location.href,
        // },
        to: '/',
      })
    }

    // if (ctx.location.href === '/') {
    //   throw redirect({
    //     to: '/app',
    //   })
    // }

    // if (!token) {
    //   throw redirect({
    //     search: {
    //       redirect: ctx.location.href,
    //     },
    //     to: '/',
    //   })
    // }
  },
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster />
    </>
  ),
})
