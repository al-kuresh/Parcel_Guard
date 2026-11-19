import type { NextConfig } from 'next';

// Where the NestJS API runs. Locally that's port 4000; in production (F12) it's
// the Render URL, set as an environment variable on Vercel.
const apiUrl = process.env.API_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  // Both are create-next-app 16 defaults, kept as-is.
  // cacheComponents: one page can mix static parts, cached parts ("use cache")
  // and live parts. Next prerenders a static "shell" and streams the rest in.
  // partialPrefetching: when a <Link> prefetches a page, it fetches only that
  // shell instead of the whole page.
  cacheComponents: true,
  partialPrefetching: true,

  // The proxy from docs/02-architecture.md §5. The browser only ever talks to
  // this Next.js server; Next forwards /api/* to the API. Same origin for the
  // browser means our auth cookies (F2) stay first-party and no CORS is needed.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUrl}/api/:path*` }];
  },

  // Tailwind CSS v4 plugs into Turbopack (Next's bundler) through this loader.
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
