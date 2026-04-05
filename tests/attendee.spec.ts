import { test, expect } from '@playwright/test';

test('attendee page loads', async ({ page }) => {
  await page.goto('/attendee');
  await expect(page.getByText('Subscribe to assistants that match your interests.')).toBeVisible();
});

test('attendee can toggle agent subscriptions and see recommendations', async ({ page }) => {
  await page.goto('/attendee');
  await expect(page.getByTestId('attendee-event-1')).toContainText('Saturday porch coffee');
  await page.getByTestId('attendee-assistant-sprint-radar').click();
  await expect(page.getByTestId('attendee-event-3')).toContainText('Idea Sprint Night');
});

test('attendee can mark an event as attending', async ({ page }) => {
  await page.goto('/attendee');
  await page.getByTestId('attendee-event-1').getByRole('button', { name: 'Attending' }).click();
  await expect(page.getByTestId('attendee-status-1')).toHaveText('Status: attending');
});
