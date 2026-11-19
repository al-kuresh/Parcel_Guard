# ParcelGuard

**ParcelGuard helps Bangladeshi Facebook/online sellers stop losing money on cash-on-delivery (COD) orders that get returned.**

Paste a messy Messenger order ("apu 2ta black L size, mirpur 10 er pase, 017XXXXXXXX") and ParcelGuard turns it into a clean order, checks the address against the official district/upazila list, scores how likely the parcel is to come back, books the courier in the background, and checks the courier's payout CSV against what you should have been paid.

> **Status:** design finished, code starts with F0. See the [build plan](docs/04-build-plan.md).

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
