import { test, expect } from '@playwright/test';

test('agents page loads', async ({ page }) => {
  await page.goto('/agents');
  await expect(page.getByText('Pick a canned agent and get event ideas.')).toBeVisible();
});

test('coffee chat curator suggests coffee frontend event', async ({ page }) => {
  await page.goto('/agents');
  await page.getByPlaceholder('something for frontend engineers who like coffee').fill('something for frontend engineers who like coffee');
  await expect(page.getByText('Coffee & Components')).toBeVisible();
});

test('demo night organizer suggests AI demo event', async ({ page }) => {
  await page.goto('/agents');
  await page.getByRole('button', { name: 'Demo Night Organizer' }).click();
  await page.getByPlaceholder('something for frontend engineers who like coffee').fill('something for AI builders showing demos');
  await expect(page.getByText('Demo Jam: AI Builders Edition')).toBeVisible();
});
