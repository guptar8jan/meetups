import { test, expect } from '@playwright/test';

test('POST /api/groups creates a group with a generated name', async ({ request }) => {
  const response = await request.post('/api/groups', {
    data: {
      prompt: 'something for frontend engineers who like coffee',
      city: 'Austin',
      flavor: 'coffee chat curator',
    },
  });

  expect(response.status()).toBe(201);
  const json = await response.json();
  expect(json.ok).toBe(true);
  const validNames = [
    'Latte & Components',
    'Espresso & Elements',
    'Beans & Breakpoints',
    'Caffeine & Components',
  ];
  expect(
    validNames.includes(json.name) || /^Latte & Components \d+$/.test(json.name)
  ).toBe(true);
});

test('POST /api/events creates an event', async ({ request }) => {
  const response = await request.post('/api/events', {
    data: {
      prompt: 'a relaxed demo night for AI builders',
      dateLabel: 'Apr 20 · 7:00 PM',
      location: 'East Austin',
      flavor: 'demo night organizer',
    },
  });

  expect(response.status()).toBe(201);
  const json = await response.json();
  expect(json.ok).toBe(true);
  expect(json.title).toBe('Demo Jam');
});
