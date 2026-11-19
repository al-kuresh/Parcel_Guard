import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // Unit tests sit next to the code (src/**/*.spec.ts).
    // End-to-end tests boot the whole app and call it over HTTP (test/**/*.e2e-spec.ts).
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
  },
});
