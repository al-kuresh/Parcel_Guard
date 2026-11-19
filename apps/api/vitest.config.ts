import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // Unit tests sit next to the code (src/**/*.spec.ts).
    // End-to-end tests boot the whole app and call it over HTTP (test/**/*.e2e-spec.ts).
    // Tests that need a real database are *.db-spec.ts and run with `pnpm test:db`.
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    env: {
      // These tests must not touch a database. PrismaService needs *a* URL to start,
      // so it gets one that points nowhere (port 1): any accidental query fails loudly.
      DATABASE_URL: 'postgresql://unit-tests-do-not-use-a-db@127.0.0.1:1/none',
    },
  },
});
