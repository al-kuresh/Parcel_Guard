# 04 — Build Plan (one feature = one branch = one PR)

> One line: **14 features from Nov 20 to Dec 3, live on the internet by Dec 2, with Dec 4 kept as a buffer.** Applications start Dec 5.

| # | Date | Branch | Feature | You learn | Done when |
|---|---|---|---|---|---|
| F0 | Nov 20 | `feat/00-scaffold` | Monorepo, Next.js + NestJS apps, shared package, Docker (Postgres + Redis), ESLint/Prettier, GitHub Actions, `CLAUDE.md` / `AGENTS.md` | pnpm workspaces, how a Next/Nest project is laid out, Docker Compose, CI | `docker compose up -d && pnpm dev` shows both apps; CI green |
| F1 | Nov 21 | `feat/01-database` | Prisma schema for all tables, first migration, seed BD locations + demo shop | Prisma schema language, migrations, relations, enums, seeding | `pnpm db:migrate && pnpm db:seed` works; tables visible in DBeaver |
| F2 | Nov 22 | `feat/02-auth` | Register, login, refresh, logout; login/register pages | argon2, JWT, httpOnly cookies, refresh-token rotation, Nest guards | Can register, log in, refresh, log out; auth tests pass |
| F3 | Nov 23 | `feat/03-shops-tenancy` | Create shop, membership, roles, invite moderator, shop switcher, tenant guard | Multi-tenancy, RBAC, custom decorators | User A can never read Shop B's data (test proves it) |
| F4 | Nov 24 | `feat/04-products-customers` | Products CRUD, customers with BD phone normalisation | REST design, pagination, Zod validation shared front/back | Product table + customer search in UI |
| F5 | Nov 25 | `feat/05-orders` | Orders API, order state machine, orders list + create form | State machines, transactions, TanStack Query, forms | Can create, confirm, cancel orders; illegal moves rejected |
| F6 | Nov 26 | `feat/06-address` | Address normaliser (district/upazila matching, quality score) | String matching, Bangla/English names, test tables | 30 messy addresses in a test file map correctly |
| F7 | Nov 27 | `feat/07-ai-intake` | Paste message → LLM → validated order draft; AI log + cost | Structured output, schema validation, provider interface, prompt design, cost tracking | Banglish message becomes a correct draft order |
| F8 | Nov 28 | `feat/08-risk` | Return-risk score with readable reasons | Rule engines, explainability, SQL aggregates | Every order shows score + reasons; rules unit-tested |
| F9 | Nov 29 | `feat/09-couriers` | Courier adapters (Mock + Steadfast/Pathao if sandbox available), BullMQ booking, webhooks | Adapter pattern, queues, retries, idempotent webhooks | Booking runs in background; webhook moves order status |
| F10 | Nov 30 | `feat/10-reconciliation` | Payout CSV upload and matching | File upload, CSV parsing, matching logic | Short/over/unknown parcels flagged correctly |
| F11 | Dec 1 | `feat/11-dashboard` | KPIs dashboard + audit log | SQL GROUP BY, date ranges, charts | Dashboard numbers match a hand-checked seed |
| F12 | Dec 2 | `feat/12-deploy` | Neon, Render, Vercel, Redis, env vars, health check, seed demo data | Real deployment, secrets, migrations in production | Live URL works on your phone |
| F13 | Dec 3 | `feat/13-polish` | Playwright smoke test, README with screenshots and diagrams, demo video script | Writing for recruiters | A stranger understands it in 60 seconds |

**Dec 4** is the buffer: fixes, your own walkthrough out loud, CV + LinkedIn update.

## Things you need to set up (only you can do these)

| When | What | Cost |
|---|---|---|
| Before F0 | Install on Zorin: Git, Node LTS via `nvm`, `pnpm` (`npm install -g pnpm`; Node 26 no longer ships corepack), Docker Engine, VS Code | Free |
| Before F7 | An LLM API key (Gemini has a free tier; OpenAI or Anthropic are paid). Put it in your local `.env`, never in chat or Git | Free–low |
| Before F9 | Optional: Steadfast/Pathao sandbox credentials. If not, we use the Mock courier | Free |
| Before F12 | Accounts on Vercel, Render, Neon (and Upstash if needed), all signed in with GitHub | Free tiers |
