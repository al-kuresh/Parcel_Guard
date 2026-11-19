import './src/load-env.js';

import { defineConfig } from 'prisma/config';

/**
 * Configuration for the Prisma CLI (migrate, generate, seed).
 * In Prisma 7 the database URL lives here instead of in schema.prisma.
 *
 * load-env.js is the same loader main.ts uses, so the CLI reads apps/api/.env
 * exactly like the running API does.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // `pnpm db:seed` runs this. tsx runs TypeScript directly, without a build step.
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Read lazily with `??` instead of `env()`, so commands that don't need a
    // database (like `prisma generate` in CI) still work without DATABASE_URL.
    url: process.env.DATABASE_URL ?? '',
  },
});
