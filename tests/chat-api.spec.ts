import { test, expect } from '@playwright/test';

test('GET /api/chat rejects unknown channel', async ({ request }) => {
  const response = await request.get('/api/chat?channel=not-a-real-channel');
  expect(response.status()).toBe(400);
  const json = await response.json();
  expect(json.ok).toBe(false);
});

test('GET /api/chat returns messages for lounge', async ({ request }) => {
  const response = await request.get('/api/chat?channel=lounge');
  expect(response.status()).toBe(200);
  const json = await response.json();
  expect(json.ok).toBe(true);
  expect(json.channel).toBe('lounge');
  expect(Array.isArray(json.messages)).toBe(true);
  expect(json.messages.length).toBeGreaterThan(0);
  const bodies = json.messages.map((m: { body: string }) => m.body);
  expect(bodies.some((b: string) => b.includes('Welcome to the lounge'))).toBe(true);
});

test('GET /api/chat returns messages for event-ideas', async ({ request }) => {
  const response = await request.get('/api/chat?channel=event-ideas');
  expect(response.status()).toBe(200);
  const json = await response.json();
  expect(json.ok).toBe(true);
  expect(json.channel).toBe('event-ideas');
  const bodies = json.messages.map((m: { body: string }) => m.body);
  expect(bodies.some((b: string) => /skill-share|Drop events/i.test(b))).toBe(true);
});

test('POST /api/chat creates a message', async ({ request }) => {
  const marker = `api-chat-${Date.now()}`;
  const response = await request.post('/api/chat', {
    data: {
      channel: 'introductions',
      author: 'PlaywrightBot',
      body: marker,
    },
  });
  expect(response.status()).toBe(201);
  const json = await response.json();
  expect(json.ok).toBe(true);
  expect(typeof json.id).toBe('number');

  const list = await request.get('/api/chat?channel=introductions');
  const listJson = await list.json();
  const found = listJson.messages.some((m: { body: string }) => m.body === marker);
  expect(found).toBe(true);
});

test('POST /api/chat validates input', async ({ request }) => {
  const missingAuthor = await request.post('/api/chat', {
    data: { channel: 'lounge', author: '', body: 'hi' },
  });
  expect(missingAuthor.status()).toBe(400);

  const missingBody = await request.post('/api/chat', {
    data: { channel: 'lounge', author: 'A', body: '' },
  });
  expect(missingBody.status()).toBe(400);

  const badChannel = await request.post('/api/chat', {
    data: { channel: 'invalid', author: 'A', body: 'hi' },
  });
  expect(badChannel.status()).toBe(400);
});
