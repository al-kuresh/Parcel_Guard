import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service.js';

/**
 * @Global() means every other module can inject PrismaService without
 * importing PrismaModule itself. Nearly every feature needs the database,
 * so this saves repeating the same import in each module.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
