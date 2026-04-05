import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Real meetup website, not fake vibes.')).toBeVisible();
});

test('organizer page loads', async ({ page }) => {
  await page.goto('/organizer');
  await expect(page.getByText('REST APIs only now. No server actions.')).toBeVisible();
});

test('organizer can submit create-group request', async ({ page }) => {
  await page.goto('/organizer');
  const groupForm = page.getByTestId('create-group-form');
  await groupForm.getByPlaceholder('something for frontend engineers who like coffee').fill('something for frontend engineers who like coffee');
  await groupForm.getByPlaceholder('Austin').fill('Austin');

  const responsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/groups') && response.request().method() === 'POST'
  );

  await groupForm.getByRole('button', { name: 'Create group' }).click();
  const response = await responsePromise;
  expect([200, 201]).toContain(response.status());

  await expect(page.getByText(/Created group:/)).toBeVisible();
  await expect(page.getByText(/Latte & Components|Espresso & Elements|Beans & Breakpoints|Caffeine & Components/)).toBeVisible();
});
