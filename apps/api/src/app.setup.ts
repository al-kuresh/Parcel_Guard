import type { INestApplication } from '@nestjs/common';

/**
 * App-wide settings, kept in one function so the real server (main.ts) and the
 * end-to-end tests configure the app in exactly the same way.
 */
export function configureApp(app: INestApplication): void {
  // Every route starts with /api, e.g. GET /api/health. The web app forwards
  // /api/* to us unchanged, so URLs look the same in the browser and here.
  app.setGlobalPrefix('api');

  // On Ctrl+C or a platform restart, let modules close connections cleanly
  // (matters from F1 on, when we hold database and Redis connections).
  app.enableShutdownHooks();
}
