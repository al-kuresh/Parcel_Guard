import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

/**
 * The root module. Each feature (auth, shops, orders, ...) becomes its own module
 * and gets listed in `imports` here, so this file reads like a table of contents.
 */
@Module({
  imports: [PrismaModule, HealthModule],
})
export class AppModule {}
