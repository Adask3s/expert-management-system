# Expert Management System — Frontend

Frontend application built with React + TypeScript, communicating with the backend (Java/Spring Boot) via REST API.

## Requirements

- **Node.js** 20+ (latest LTS recommended)
- **npm** (bundled with Node.js)
- A running backend (defaults to `http://localhost:8080`) — see the backend README

## Installation

```bash
npm install
```

## Environment configuration

The project uses Vite environment variables. The root directory contains a `.env.example` file:

```
VITE_API_BASE_URL=http://localhost:8080/
```

You need to create a .env file with this value. If the backend runs on a different host/port, update this value. For a
local, git-ignored override, create a `.env.local` file with your own values — it will take precedence over `.env`.

## Running in development mode

```bash
npm run dev
```

The app will start at `http://localhost:5173` by default (Vite will print the exact address in the console). It requires
a running backend at the address configured in `VITE_API_BASE_URL`.

## Production build

```bash
npm run build
```

The build output goes to the `dist/` directory. To preview the production build locally:

```bash
npm run preview
```

## Tests

```bash
npm run test        # watch mode (Vitest)
npm run test:run     # single run
```

## Linting

```bash
npm run lint
```

## Generating API types from OpenAPI

The project generates TypeScript types from the backend's OpenAPI specification:

```bash
npm run generate:api
```

This requires the file `../backend/src/main/resources/expert-management-openapi.yaml` to exist (i.e. a `backend`
directory next to `frontend`, at the same level). The generated file is written to `src/types/api.d.ts` — don't edit it
by hand, regenerate it instead whenever the backend API changes.

## `src` directory structure

```
src/
├── api/             # HTTP client (axios)
├── assets/icons/    # SVG icons (imported as React components via vite-plugin-svgr)
├── components/
│   ├── common/      # reusable components (Button, Badge, Table, IconButton, UserAvatar)
│   ├── layout/      # app layout (AppLayout)
│   └── users/       # components specific to the users module
├── hooks/           # custom hooks (React Query, etc.)
├── pages/           # views/pages (Dashboard, Domains...)
├── routes/          # routing configuration
├── services/        # API communication layer (mapped to backend endpoints)
├── styles/          # design tokens (tokens.css)
└── types/           # types, including the ones generated from OpenAPI (api.d.ts)
```

## Main technologies

- React 19 + React Router 7
- TanStack React Query — server-state/query cache management
- Axios — HTTP client
- Vite 8 — bundler and dev server
- Vitest + Testing Library — testing
- ESLint (flat config) — linting
- CSS Modules + design tokens (`src/styles/tokens.css`)

## Quick start (TL;DR)

```bash
cd frontend
npm install
npm run dev
```

Make sure the backend is running and reachable at the address configured in `VITE_API_BASE_URL` in `.env`.