import { Injectable } from '@nestjs/common';
import type { HealthResponse } from '@parcelguard/shared';

@Injectable()
export class HealthService {
  /**
   * Says the API process is up. From F12 this will also check that the
   * database and Redis answer, so the hosting platform can restart us if not.
   */
  check(): HealthResponse {
    return {
      status: 'ok',
      service: 'api',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
