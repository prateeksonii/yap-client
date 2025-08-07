import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="">
      <div className="text-2xl">Open an existing chat or create a new one</div>
    </main>
  )
}
