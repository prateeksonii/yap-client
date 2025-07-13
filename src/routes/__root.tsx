import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

export const Route = createRootRoute({
	beforeLoad: async (ctx) => {
		if (ctx.location.href === "/") {
			return;
		}

		const token = localStorage.getItem("yap_token");
		if (!token) {
			throw redirect({
				search: {
					redirect: ctx.location.href,
				},
				to: "/",
			});
		}
	},
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
			<Toaster />
		</>
	),
});
