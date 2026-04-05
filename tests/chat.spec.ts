import { test, expect } from '@playwright/test';

test('chat page loads with Discord-style channels', async ({ page }) => {
  await page.goto('/chat');
  await expect(page.getByRole('heading', { name: 'Chat', exact: true })).toBeVisible();
  await expect(page.getByTestId('chat-channel-lounge')).toBeVisible();
  await expect(page.getByTestId('chat-channel-event-ideas')).toBeVisible();
  await expect(page.getByTestId('chat-channel-introductions')).toBeVisible();
  await expect(page.getByTestId('chat-message-list')).toBeVisible();
});

test('chat shows seeded lounge message', async ({ page }) => {
  await page.goto('/chat');
  await expect(page.getByText('Welcome to the lounge.')).toBeVisible();
});

test('user can switch to event-suggestions channel', async ({ page }) => {
  await page.goto('/chat');
  await page.getByTestId('chat-channel-event-ideas').click();
  await expect(page.getByRole('heading', { name: 'event-suggestions' })).toBeVisible();
  await expect(page.getByText(/Drop events you/)).toBeVisible();
});

test('user can post a message and see it in the thread', async ({ page }) => {
  const body = `ui-chat-${Date.now()} — neighborhood board game night?`;
  await page.goto('/chat');
  await page.getByTestId('chat-composer').fill(body);
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByTestId('chat-message-list').getByText(body)).toBeVisible();
});

test('[event] prefix shows event idea badge in UI', async ({ page }) => {
  const body = `[event] Playwright seed: park cleanup ${Date.now()}`;
  await page.goto('/chat');
  await page.getByTestId('chat-channel-lounge').click();
  await page.getByTestId('chat-composer').fill(body);
  await page.getByRole('button', { name: 'Send' }).click();
  const row = page.locator('[data-testid^="chat-message-"]').filter({ hasText: body });
  await expect(row.getByText(body)).toBeVisible();
  await expect(row.getByText('event idea')).toBeVisible();
});
