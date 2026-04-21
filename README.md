# PrintLabeler

PrintLabeler is a Next.js app for designing and previewing A4 product-label sheets with rich-text cell editing, copy/paste shortcuts, and print-ready output.  
It supports customizable grid layouts and print margins, with Supabase-backed auth and layout management for saving reusable sheet configurations.

## Features

- A4 label-sheet canvas editor with cell-level rich text formatting
- Print workflow with configurable top/right/bottom/left print margins
- Keyboard shortcuts for copy/paste between selected label cells
- Autosave of current template payload to local storage
- Admin page to create and manage reusable sheet layouts
- Supabase authentication integration for signed-in workflows

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Zustand for editor state management
- Tiptap for rich text editing
- Supabase for auth and persisted layouts
- React Query + Vitest + ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 10+

### Install and Run

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:3000`.

## Scripts

- `pnpm dev` - start development server
- `pnpm build` - create production build
- `pnpm start` - run production server
- `pnpm lint` - run ESLint
- `pnpm lint:fix` - auto-fix lint issues
- `pnpm format` - format code with Prettier
- `pnpm format:check` - check formatting
- `pnpm test` - run test suite

## Project Structure

- `src/app` - Next.js routes and pages
- `src/components` - UI/editor/canvas components
- `src/lib` - utilities such as print helpers and validation
- `src/store` - Zustand editor store
- `src/types` - shared TypeScript types
- `supabase` - Supabase-related assets/configuration
