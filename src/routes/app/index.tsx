import { createFileRoute } from "@tanstack/react-router";
import React from 'react';

export const Route = createFileRoute("/app/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (<div className="mx-auto h-screen container py-8"><div className="h-full grid grid-cols-[400px_auto]">
		<div>
			<h4 className="text-2xl">Hop</h4>
			<div>Recent chats</div>
		</div>
		<div className="flex flex-col h-full"><div className="flex-1">chat</div>
			<div>text</div></div>
	</div></div>);
}
