# ParcelGuard

**ParcelGuard helps Bangladeshi Facebook/online sellers stop losing money on cash-on-delivery (COD) orders that get returned.**

Paste a messy Messenger order ("apu 2ta black L size, mirpur 10 er pase, 017XXXXXXXX") and ParcelGuard turns it into a clean order, checks the address against the official district/upazila list, scores how likely the parcel is to come back, books the courier in the background, and checks the courier's payout CSV against what you should have been paid.

> **Status:** F1 (database) in progress. See the [build plan](docs/04-build-plan.md).

## Quick start

You need Node 26+, pnpm 12, and Docker with Compose.

```bash
pnpm install                 # install every package in the monorepo
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
docker compose up -d         # start Postgres and Redis in the background
pnpm db:migrate              # create all tables (runs the migrations in apps/api/prisma/migrations)
pnpm db:seed                 # add BD locations and a demo shop
pnpm dev                     # run the API (:4000) and the web app (:3000) together
```

Open http://localhost:3000. A green **API is up** card means the web app reached the API through its `/api` proxy.

| Command | What it does |
|---|---|
| `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build` | The same checks CI runs on every pull request |
| `pnpm test:db` | Database tests (needs Postgres running, migrated and seeded) |
| `pnpm db:migrate` | Apply migrations; after editing `schema.prisma`, `pnpm db:migrate --name what-changed` creates a new one |
| `pnpm db:seed` | Add BD locations and the demo shop (safe to run again) |
| `pnpm db:reset` | Delete everything and re-run all migrations (asks first), then run `pnpm db:seed` |
| `pnpm format` | Format all code with Prettier |
| `docker compose down` | Stop Postgres and Redis (data is kept) |

## Repository layout

```
apps/api         NestJS API: business logic, database, queues, webhooks
apps/web         Next.js app: the screens sellers use
packages/shared  Zod schemas and types shared by both apps
docs/            Design docs and my learning notes
```

## Tech stack

Next.js · NestJS · PostgreSQL · Prisma · Redis + BullMQ · Zod · an LLM provider interface (Gemini / OpenAI / Claude) · Docker Compose · GitHub Actions

## Design docs

| Doc | What's in it |
|---|---|
| [00 — How we work](docs/00-how-we-work.md) | Workflow, git rules, review process |
| [01 — Product spec](docs/01-product-spec.md) | The problem, users, features, what's out of scope |
| [02 — Architecture](docs/02-architecture.md) | System diagram, folder layout, tech choices and why |
| [03 — Database design](docs/03-database-design.md) | ERD, tables, order state machine, indexes |
| [04 — Build plan](docs/04-build-plan.md) | Features F0–F13, one branch and one PR each |

## How this project is built

Each feature is built on its own `feat/NN-name` branch and arrives as a pull request with a step-by-step explanation. I run it, read it, review it, and merge it myself. Commits made with my AI architect carry a `Co-Authored-By: Claude` trailer.
