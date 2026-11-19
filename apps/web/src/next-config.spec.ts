/**
 * Tests the /api proxy rule in next.config.ts (docs/02-architecture.md §5).
 *
 * next.config.ts reads API_URL when it is first imported, so each test sets the
 * variable, clears Vitest's module cache, and imports the file fresh.
 */
async function loadRewrites() {
  vi.resetModules();
  const { default: config } = await import('../next.config');
  if (typeof config.rewrites !== 'function') throw new Error('next.config has no rewrites()');
  return config.rewrites();
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('next.config.ts /api proxy', () => {
  it('forwards /api/* to the local API on port 4000 by default', async () => {
    vi.stubEnv('API_URL', undefined);

    expect(await loadRewrites()).toEqual([
      { source: '/api/:path*', destination: 'http://localhost:4000/api/:path*' },
    ]);
  });

  it('forwards /api/* to API_URL when it is set (production on Render)', async () => {
    vi.stubEnv('API_URL', 'https://parcelguard-api.onrender.com');

    expect(await loadRewrites()).toEqual([
      { source: '/api/:path*', destination: 'https://parcelguard-api.onrender.com/api/:path*' },
    ]);
  });
});
