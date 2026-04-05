import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Real meetup website, not fake vibes.')).toBeVisible();
});

test('organizer page loads', async ({ page }) => {
  await page.goto('/organizer');
  await expect(page.getByText('REST APIs only now. No server actions.')).toBeVisible();
});

test('can create a group from prompt', async ({ page }) => {
  await page.goto('/organizer');
  const groupForm = page.getByTestId('create-group-form');
  await groupForm.getByPlaceholder('something for frontend engineers who like coffee').fill('something for frontend engineers who like coffee');
  await groupForm.getByPlaceholder('Austin').fill('Austin');
  await groupForm.getByRole('button', { name: 'Create group' }).click();
  await expect(page.getByText('Created group: Latte & Components')).toBeVisible();
  await page.goto('/');
  await expect(page.getByText('Latte & Components')).toBeVisible();
});
