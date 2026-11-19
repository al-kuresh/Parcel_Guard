import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { healthResponseSchema } from '@parcelguard/shared';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

describe('GET /api/health (e2e)', () => {
  // <App> tells TypeScript what getHttpServer() returns, so supertest gets a typed server.
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app); // same settings as the real server, so /api prefix applies
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 200 with a body that matches the shared schema', async () => {
    const response = await request(app.getHttpServer()).get('/api/health').expect(200);

    // The same schema the web app uses. If the API ever drifts, this test fails.
    expect(healthResponseSchema.safeParse(response.body).success).toBe(true);
  });

  it('does not serve routes without the /api prefix', async () => {
    await request(app.getHttpServer()).get('/health').expect(404);
  });
});
