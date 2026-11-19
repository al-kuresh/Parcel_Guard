import { render, screen } from '@testing-library/react';

import { ApiStatus } from './api-status';

/**
 * We don't start the real API here. Instead we replace the browser's `fetch`
 * with a fake (`vi.fn`) and decide what it answers. That lets us test every
 * situation the card must handle, including ones that are hard to cause on purpose.
 */
function fakeFetch(impl: () => Promise<Response>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const healthyBody = {
  status: 'ok',
  service: 'api',
  uptimeSeconds: 42,
  timestamp: '2026-11-20T04:00:00.000Z',
};

afterEach(() => {
  vi.unstubAllGlobals(); // put the real fetch back so tests don't affect each other
});

describe('<ApiStatus>', () => {
  it('shows "checking" before the answer arrives', () => {
    fakeFetch(() => new Promise<Response>(() => {})); // a request that never finishes
    render(<ApiStatus />);

    expect(screen.getByText(/checking/)).toBeTruthy();
  });

  it('asks the same-origin /api/health URL, so the Next.js proxy is used', async () => {
    const fetchMock = fakeFetch(async () => Response.json(healthyBody));
    render(<ApiStatus />);
    await screen.findByText(/is up/);

    expect(fetchMock).toHaveBeenCalledWith('/api/health', expect.anything());
  });

  it('shows "API is up" and the uptime when the API answers correctly', async () => {
    fakeFetch(async () => Response.json(healthyBody));
    render(<ApiStatus />);

    expect(await screen.findByText(/is up/)).toBeTruthy();
    expect(screen.getByText('42s')).toBeTruthy();
  });

  it('shows the HTTP status when the API answers with an error', async () => {
    fakeFetch(async () => new Response('Internal Server Error', { status: 500 }));
    render(<ApiStatus />);

    expect(await screen.findByText('API answered HTTP 500')).toBeTruthy();
  });

  it('rejects an answer that does not match the shared schema', async () => {
    fakeFetch(async () => Response.json({ status: 'ok' })); // missing fields
    render(<ApiStatus />);

    expect(await screen.findByText(/not in the expected shape/)).toBeTruthy();
  });

  it('explains the problem when the API cannot be reached at all', async () => {
    fakeFetch(() => Promise.reject(new TypeError('Failed to fetch')));
    render(<ApiStatus />);

    expect(await screen.findByText(/Could not reach the API/)).toBeTruthy();
  });
});
