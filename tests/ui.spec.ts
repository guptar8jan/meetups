import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('A place to discover, host, and grow communities.')).toBeVisible();
});

test('organizer page loads', async ({ page }) => {
  await page.goto('/organizer');
  await expect(page.getByText('Create groups and events from simple prompts.')).toBeVisible();
});

test('organizer can submit create-group request', async ({ page }) => {
  await page.goto('/organizer');
  const groupForm = page.getByTestId('create-group-form');
  await groupForm.getByPlaceholder('a welcoming social group for people who enjoy coffee and conversation').fill('neighbors who enjoy meeting for coffee on weekends');
  await groupForm.getByPlaceholder('Austin').fill('Riverside');

  const responsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/groups') && response.request().method() === 'POST'
  );

  await groupForm.getByRole('button', { name: 'Create group' }).click();
  const response = await responsePromise;
  expect([200, 201]).toContain(response.status());

  await expect(page.getByText(/Created group:/)).toBeVisible();
  await expect(page.getByText(/Corner Cup & Chat|Porchlight Coffee Circle|Welcome Mug Club|Morning Meet & Greet/)).toBeVisible();
});
