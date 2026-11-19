import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client.js';
import { requireDatabaseUrl } from './create-prisma-client.js';

/**
 * The database client as a Nest provider. Feature services get it by asking
 * for it in their constructor (dependency injection), starting in F2:
 *
 *   constructor(private readonly prisma: PrismaService) {}
 *
 * It *is* a PrismaClient (it extends it), so `this.prisma.order.findMany(...)` works.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaPg({ connectionString: requireDatabaseUrl() }) });
  }

  /** On shutdown (Ctrl+C, a redeploy), close the connection pool cleanly. */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
