# Learning notes

# F0 — Monorepo scaffold (Nov 20, 2026)

## What F0 is
F0 is the empty skeleton of ParcelGuard. It has no business features yet,
but every part runs: a Next.js web app (port 3000), a NestJS API (port 4000),
a shared package, Postgres and Redis in Docker, and CI on GitHub.

## Monorepo
A monorepo means several apps live in one Git repo. pnpm workspaces link
them, so both apps can import the same code from packages/shared.
Why: I write a validation rule once (with Zod), and the web app and the API
both use it, so they can't disagree about what the data looks like.

## The proxy
The browser only talks to the web app on port 3000. When it asks for
/api/something, Next.js forwards the request to the API on port 4000.
Why: in production the web app and API are on different domains, and browsers
block cookies between different sites. With the proxy, the browser sees one
domain, so the login cookies (F2) keep working, and we don't need CORS.

## Other things I learned
- Docker runs only the databases. The apps run on my laptop with pnpm dev.
- CI checks every PR (lint, typecheck, test, build). Never merge a red PR.
- A type only checks my code when it compiles. Data from the network must be
  checked at runtime with a schema.
- A test that always passes is useless. Codex caught that in PR #1.
