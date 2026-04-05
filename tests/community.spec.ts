import { test, expect } from '@playwright/test';

test('community page loads', async ({ page }) => {
  await page.goto('/community');
  await expect(page.getByText('Community chatter and upvoted ideas.')).toBeVisible();
});

test('community can upvote an idea', async ({ page }) => {
  await page.goto('/community');
  await page.getByRole('button', { name: 'I’m interested' }).first().click();
  await expect(page.getByText(/votes/).first()).toBeVisible();
});

test('community can post a new idea', async ({ page }) => {
  await page.goto('/community');
  await page.getByPlaceholder('What should we host next?').fill('Design systems brunch');
  await page.getByPlaceholder('Describe the vibe, audience, or format...').fill('A cozy meetup for design system people who want coffee and component gossip.');
  await page.getByPlaceholder('frontend / ai / social / hackathon').fill('design');
  await page.getByRole('button', { name: 'Post idea' }).click();
  await expect(page.getByText('Design systems brunch')).toBeVisible();
});
