import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // jsdom is a fake browser (document, window, fetch...) that runs inside Node,
    // so React components can render in tests without opening Chrome.
    environment: 'jsdom',
    include: ['src/**/*.spec.{ts,tsx}'],
  },
});
