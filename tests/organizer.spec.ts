import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('A place to discover, host, and grow communities.')).toBeVisible();
});

test('organizer page loads', async ({ page }) => {
  await page.goto('/organizer');
  await expect(page.getByText('Create groups and events from simple prompts.')).toBeVisible();
});

test('can create a group from prompt', async ({ page }) => {
  await page.goto('/organizer');
  const groupForm = page.getByTestId('create-group-form');
  await groupForm.getByPlaceholder('a welcoming social group for people who enjoy coffee and conversation').fill('neighbors who enjoy meeting for coffee on weekends');
  await groupForm.getByPlaceholder('Austin').fill('Riverside');
  await groupForm.getByRole('button', { name: 'Create group' }).click();
  await expect(page.getByText(/Created group: (Corner Cup & Chat|Porchlight Coffee Circle|Welcome Mug Club|Morning Meet & Greet)/)).toBeVisible();
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: /Corner Cup & Chat|Porchlight Coffee Circle|Welcome Mug Club|Morning Meet & Greet/ }).first()
  ).toBeVisible();
});
