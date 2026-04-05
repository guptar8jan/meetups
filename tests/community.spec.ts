import { test, expect } from '@playwright/test';

test('community page loads', async ({ page }) => {
  await page.goto('/community');
  await expect(page.getByText('Organizer ideas and community voting.')).toBeVisible();
});

test('community can upvote an idea', async ({ page }) => {
  await page.goto('/community');
  await page.getByRole('button', { name: 'I’m interested' }).first().click();
  await expect(page.getByText(/votes/).first()).toBeVisible();
});

test('community can post a new idea', async ({ page }) => {
  await page.goto('/community');
  await page.getByPlaceholder('What should we host next?').fill('Summer movie night in the park');
  await page.getByPlaceholder('Describe the format, audience, or vibe...').fill(
    "Bring blankets and snacks; we'll project a family-friendly film after sunset."
  );
  await page.getByPlaceholder('social / learning / showcase / collaboration').fill('social');
  await page.getByRole('button', { name: 'Post idea' }).click();
  await expect(page.getByText('Summer movie night in the park')).toBeVisible();
});
