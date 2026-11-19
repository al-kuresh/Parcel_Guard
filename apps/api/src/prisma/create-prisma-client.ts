import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client.js';

/**
 * Reads DATABASE_URL and fails with a clear message if it's missing,
 * instead of a confusing connection error later.
 */
export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Copy apps/api/.env.example to apps/api/.env (see README → Quick start).',
    );
  }
  return url;
}

/**
 * The one place that knows how to build a Prisma client.
 *
 * Prisma 7 talks to Postgres through a "driver adapter": here @prisma/adapter-pg,
 * which uses the popular `pg` library underneath. The connection pool opens
 * lazily, on the first query, not when this function runs.
 *
 * Used by PrismaService (the running API), the seed script and the database tests.
 */
export function createPrismaClient(url: string = requireDatabaseUrl()): PrismaClient {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}
