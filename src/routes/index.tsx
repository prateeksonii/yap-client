import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SignIn from "@/components/signin";
import SignUp from "@/components/signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const [currentTab, setCurrentTab] = useState<"signin" | "signup">("signin");

	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-2 gap-8 h-screen place-items-center place-content-center">
				<div>
					<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
						Yap
					</h1>
					<p className="text-muted-foreground text-xl">
						Conversations. Redefined.
					</p>
				</div>
				<div>
					<Tabs value={currentTab} defaultValue="signin" className="mx-auto w-[400px]">
						<TabsList>
							<TabsTrigger value="signin">Sign in</TabsTrigger>
							<TabsTrigger value="signup">Sign up</TabsTrigger>
						</TabsList>

						<TabsContent value="signin">
							<SignIn />
						</TabsContent>

						<TabsContent value="signup">
							<SignUp setCurrentTab={setCurrentTab} />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
