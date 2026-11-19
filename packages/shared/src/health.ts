import { z } from 'zod';

/**
 * What `GET /api/health` returns.
 *
 * The API uses the TypeScript type (`HealthResponse`) so the compiler checks
 * it returns the right shape. The web app uses the schema at runtime, because
 * data arriving over the network is never trusted just because a type says so.
 */
export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('api'),
  uptimeSeconds: z.number().int().nonnegative(),
  timestamp: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
