'use client';

import { type HealthResponse, healthResponseSchema } from '@parcelguard/shared';
import { useEffect, useState } from 'react';

type Status =
  | { state: 'loading' }
  | { state: 'up'; health: HealthResponse }
  | { state: 'down'; reason: string };

/**
 * Asks the API "are you alive?" from the browser.
 *
 * Note the URL is just `/api/health`: same origin as this page. Next.js forwards
 * it to the NestJS server (see next.config.ts), so the browser never needs to
 * know where the API really lives.
 */
export function ApiStatus() {
  const [status, setStatus] = useState<Status>({ state: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    async function check() {
      try {
        const response = await fetch('/api/health', { signal: controller.signal });
        if (!response.ok) {
          setStatus({ state: 'down', reason: `API answered HTTP ${response.status}` });
          return;
        }
        // Never trust network data just because TypeScript has a type for it:
        // parse it with the shared schema, the same one the API's tests use.
        const parsed = healthResponseSchema.safeParse(await response.json());
        setStatus(
          parsed.success
            ? { state: 'up', health: parsed.data }
            : { state: 'down', reason: 'API answered, but not in the expected shape' },
        );
      } catch {
        if (!controller.signal.aborted) {
          setStatus({ state: 'down', reason: 'Could not reach the API. Is `pnpm dev` running?' });
        }
      }
    }

    void check();
    return () => controller.abort(); // stop the request if the component unmounts
  }, []);

  return (
    <section
      aria-live="polite"
      className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={`h-3 w-3 rounded-full ${
            status.state === 'up'
              ? 'bg-emerald-500'
              : status.state === 'down'
                ? 'bg-red-500'
                : 'animate-pulse bg-stone-400'
          }`}
        />
        <h2 className="font-medium">
          API{' '}
          {status.state === 'up'
            ? 'is up'
            : status.state === 'down'
              ? 'is unreachable'
              : 'status: checking…'}
        </h2>
      </div>

      {status.state === 'up' && (
        <dl className="mt-4 grid grid-cols-2 gap-y-1 text-sm">
          <dt className="text-stone-500">Uptime</dt>
          <dd className="font-mono">{status.health.uptimeSeconds}s</dd>
          <dt className="text-stone-500">Server time</dt>
          <dd className="font-mono">{status.health.timestamp}</dd>
        </dl>
      )}
      {status.state === 'down' && (
        <p className="mt-3 text-sm text-red-700 dark:text-red-400">{status.reason}</p>
      )}
    </section>
  );
}
