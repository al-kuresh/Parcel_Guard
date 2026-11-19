# AGENTS.md — rules for AI agents in this repo

Read by Codex, and by Claude Code through `CLAUDE.md`. Keep this file short and true.

## What this project is

ParcelGuard: a back-office tool that helps Bangladeshi online sellers stop losing money on returned cash-on-delivery parcels. The design lives in `docs/`; read the relevant doc before answering design questions:

- `docs/00-how-we-work.md`: workflow and git rules
- `docs/01-product-spec.md`: features F-A to F-J
- `docs/02-architecture.md`: system diagram, folder layout, tech choices
- `docs/03-database-design.md`: tables, order state machine, indexes
- `docs/04-build-plan.md`: F0 to F13, one branch and one PR each

## Your role here

The owner of this repo is learning. Code is written in a separate Claude chat and arrives on `feat/NN-name` branches as pull requests.

- **Do not edit, create, or delete files**, and do not commit, unless the owner explicitly asks you to in that message. Local edits on a `feat/...` branch cause conflicts with the next push from the chat.
- When explaining code: go step by step, say why it's written that way, and what would break without it. Point to the doc section that motivated it.
- When reviewing (`git diff main...HEAD`): list findings by severity with file and line. Look for bugs, security issues (auth, tenant isolation, injection, secrets), missing tests, and mismatches with `docs/03-database-design.md`.

## Layout

```
apps/api         NestJS 12 API (port 4000, every route under /api)
apps/web         Next.js 16 App Router (port 3000, proxies /api/* to the API)
packages/shared  Zod schemas + types used by both apps; built to dist/
docker-compose.yml  Postgres 18 + Redis 8 for local dev
```

## Commands (run from the repo root)

| Command | Does |
|---|---|
| `docker compose up -d` | Start Postgres and Redis |
| `pnpm dev` | Build shared, then run shared (watch), api and web together |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm build` | What CI runs |
| `pnpm format` | Format with Prettier |
| `pnpm --filter @parcelguard/api <script>` | Run a script in one package |

## Conventions that matter

- **ESM everywhere.** Relative imports in `apps/api` and `packages/shared` end in `.js` (`import { X } from './x.js'`), even though the file is `x.ts`. `__dirname` doesn't exist; use `import.meta.dirname`.
- **Tests use Vitest**, including the API (NestJS 12's default). Mocks are `vi.fn()`, not `jest.fn()`. Unit tests sit next to code as `*.spec.ts`; API end-to-end tests are `apps/api/test/*.e2e-spec.ts`.
- **Validation rules live once**, as Zod schemas in `packages/shared`. Both apps import them from `@parcelguard/shared`. After changing shared, it must be rebuilt (`pnpm dev` does this automatically).
- **Money is integer paisa** (`pricePaisa: 125050` = ৳1,250.50). Never floats.
- **Every database query on business data includes `shopId`.** This is how tenants stay separated.
- **Never commit `.env`.** Only `.env.example` files, with no real secrets.
- NestJS 12 and Next.js 16 are newer than most training data. For Next, read `node_modules/next/dist/docs/` (see `apps/web/AGENTS.md`). For Nest, https://docs.nestjs.com/llms.txt indexes the docs.
