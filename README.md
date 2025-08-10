
# Yap

Yap Client is a modern chat application built with React, TanStack Router, TanStack Query, Zustand, and Vite. It features real-time messaging, authentication, contact management, and a beautiful UI using Radix UI and Lucide icons.

## Features

- Modern React (v19) + Vite setup
- File-based routing with TanStack Router
- Real-time chat and contact management
- Authentication (token-based)
- Zustand for global state management
- TanStack Query for data fetching and caching
- Radix UI and Lucide icons for accessible, stylish components
- CSS and Tailwind utilities for styling
- Vitest for unit testing

## Getting Started

Install dependencies:

```bash
bun install
```

Start the development server:

```bash
bun run dev
```

## Building For Production

```bash
bun run build
```

## Running Tests

```bash
bun run test
```

## Project Structure

- `src/components/` — UI and feature components (Sidebar, Chat, Auth, etc.)
- `src/routes/` — File-based routes for TanStack Router
- `src/lib/` — API clients, stores, and utilities
- `public/` — Static assets

## Routing

Routes are managed in `src/routes` using TanStack Router. Dynamic chat routes are supported (e.g. `/app/:chatId`).

## State Management

Global state (user, status, UI state) is managed with Zustand (`src/lib/stores.ts`).

## Data Fetching

TanStack Query is used for all API calls and caching. See `src/lib/api/` for API clients.

## Styling

CSS and Tailwind utilities are used for styling. Radix UI primitives provide accessible UI components.

## Icons

Lucide icons are used throughout the app for a modern look.

## Authentication

Token-based authentication. Sign in/out updates localStorage and app state.

## Contributing

PRs and issues welcome!

## License

MIT
