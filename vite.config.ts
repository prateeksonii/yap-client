import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { resolve } from "node:path";
import tanstackRouter from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tanstackRouter({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	server: {
		host: '0.0.0.0',
		port: 5173
	}
});
