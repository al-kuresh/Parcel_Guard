import { ApiStatus } from './api-status';

// A Server Component (the default in the App Router): it renders on the server
// and sends HTML. Interactive parts, like <ApiStatus>, are Client Components.
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
          F0 · Scaffold
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">ParcelGuard</h1>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          Stop losing money on returned cash-on-delivery parcels.
        </p>
      </header>

      <ApiStatus />

      <p className="text-sm text-stone-500">
        This page lives in <code className="font-mono">apps/web</code>. The status above comes from{' '}
        <code className="font-mono">apps/api</code> through the Next.js proxy at{' '}
        <code className="font-mono">/api/health</code>.
      </p>
    </main>
  );
}
