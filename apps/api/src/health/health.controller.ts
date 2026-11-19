import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@parcelguard/shared';

import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  // Nest sees HealthService in the constructor and passes in an instance for us.
  // This is dependency injection: the controller never does `new HealthService()`.
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.healthService.check();
  }
}
