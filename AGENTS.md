<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## MCPs

- Playwright screenshots, logs, snapshots, and anything Playwright-related go in `.playwright-mcp/` (gitignored, never commit).
- Context7 MCP: use it for current Next.js / React / Tailwind docs.

## Stack

- Next.js 16.3.5 (App Router) + React 19 + Tailwind CSS v4 + strict TS. Fresh `create-next-app`; the real app is not built yet.
- Entrypoints: `app/layout.tsx`, `app/page.tsx`. Path alias `@/*` maps to repo root.
- No test runner, no CI, no pre-commit. Do not invent test commands.

## Commands

- `npm run dev` (http://localhost:3000), `npm run build`, `npm run start`
- `npm run lint` (flat config: `next/core-web-vitals` + `next/typescript`)
- Typecheck: `npx tsc --noEmit` (no script defined)
- Verify order: `lint` -> `tsc --noEmit` -> `build`

## Next.js 16 gotchas

- This major has breaking changes vs training data. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecations.
- Never delete the `nextjs-agent-rules` block at the top of this file: `next dev` re-adds it, so commit it with your work to keep the tree clean.

## UI source of truth

- `references/pantallas/*.dc.html` are static clickable mockups of every screen (open in a browser; `support.js` renders the `<x-dc>` elements). `references/screenshots/*.png` mirror them.
- When building screens, match the mockups (Fredoka + Nunito fonts, warm cream palette), don't invent a new visual language.

## Workflow

- Spec-driven skills live in `.agents/skills/` (`spec`, `spec-impl`); use them for large features.

## Spec Driven Development - Skills

- /spec usaremos esta habilidad para crear las especificaciones. 
- /spec-impl usaremos estos skills para crear las implementaciones. 