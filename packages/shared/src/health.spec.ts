import { healthResponseSchema } from './health.js';

describe('healthResponseSchema', () => {
  const valid = {
    status: 'ok',
    service: 'api',
    uptimeSeconds: 12,
    timestamp: '2026-11-20T04:00:00.000Z',
  };

  it('accepts a correct health response', () => {
    expect(healthResponseSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a response with a missing field', () => {
    const withoutTimestamp: Partial<typeof valid> = { ...valid };
    delete withoutTimestamp.timestamp;
    expect(healthResponseSchema.safeParse(withoutTimestamp).success).toBe(false);
  });

  it('rejects a status other than "ok"', () => {
    expect(healthResponseSchema.safeParse({ ...valid, status: 'down' }).success).toBe(false);
  });

  it('rejects a negative uptime', () => {
    expect(healthResponseSchema.safeParse({ ...valid, uptimeSeconds: -1 }).success).toBe(false);
  });
});
