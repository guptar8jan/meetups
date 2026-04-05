import { test, expect } from '@playwright/test';

test('attendee page loads', async ({ page }) => {
  await page.goto('/attendee');
  await expect(page.getByText('Subscribe to agents that match your interests.')).toBeVisible();
});

test('attendee can toggle agent subscriptions and see recommendations', async ({ page }) => {
  await page.goto('/attendee');
  await expect(page.getByText('Coffee & Components')).toBeVisible();
  await page.getByRole('button', { name: 'Hackathon Radar' }).click();
  await expect(page.getByText('Build Sprint Night')).toBeVisible();
});

test('attendee can mark an event as attending', async ({ page }) => {
  await page.goto('/attendee');
  await page.getByRole('button', { name: 'Attending' }).first().click();
  await expect(page.getByText(/Status: attending/)).toBeVisible();
});
