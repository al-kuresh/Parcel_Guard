import { defineConfig } from 'vitest/config';

/**
 * Database tests (`pnpm test:db`). Kept apart from `pnpm test` because they need
 * Postgres running, migrated and seeded; the normal tests run anywhere.
 */
export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.db-spec.ts'],
    setupFiles: ['./src/load-env.ts'], // read DATABASE_URL from apps/api/.env
    // One file at a time: these tests share a real database.
    fileParallelism: false,
  },
});
