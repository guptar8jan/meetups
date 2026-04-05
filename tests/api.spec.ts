import { test, expect } from '@playwright/test';

test('POST /api/groups creates a group with a generated name', async ({ request }) => {
  const response = await request.post('/api/groups', {
    data: {
      prompt: 'neighbors who enjoy meeting for coffee on weekends',
      city: 'Riverside',
      flavor: 'community planner',
    },
  });

  expect(response.status()).toBe(201);
  const json = await response.json();
  expect(json.ok).toBe(true);
  const validNames = [
    'Corner Cup & Chat',
    'Porchlight Coffee Circle',
    'Welcome Mug Club',
    'Morning Meet & Greet',
  ];
  expect(
    validNames.includes(json.name) || /^Corner Cup & Chat \d+$/.test(json.name)
  ).toBe(true);
});

test('POST /api/events creates an event', async ({ request }) => {
  const response = await request.post('/api/events', {
    data: {
      prompt: 'spring potluck on the block with shared dishes',
      dateLabel: 'Apr 20 · 6:00 PM',
      location: 'Oak Street green',
      flavor: 'social host',
    },
  });

  expect(response.status()).toBe(201);
  const json = await response.json();
  expect(json.ok).toBe(true);
  expect(json.title).toBe('Community Potluck Night');
});
