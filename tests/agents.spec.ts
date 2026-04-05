import { test, expect } from '@playwright/test';

test('agents page loads with role choice', async ({ page }) => {
  await page.goto('/agents');
  await expect(page.getByText('Assistants for organizers and attendees.')).toBeVisible();
  await expect(page.getByTestId('role-organizer')).toBeVisible();
  await expect(page.getByTestId('role-attendee')).toBeVisible();
});

test('conversation curator suggests coffee gathering', async ({ page }) => {
  await page.goto('/agents');
  await expect(page.getByTestId('role-organizer')).toBeVisible();
  await page.getByPlaceholder('a welcoming social event for people who enjoy coffee and conversation').fill('a welcoming morning gathering with coffee on the porch');
  await expect(page.getByRole('heading', { name: 'Coffee & Conversation', exact: true })).toBeVisible();
});

test('showcase organizer suggests showcase night', async ({ page }) => {
  await page.goto('/agents');
  await page.getByTestId('organizer-assistant-showcase-organizer').click();
  await page.getByPlaceholder('a welcoming social event for people who enjoy coffee and conversation').fill('an evening for neighbors to share creative ideas');
  await expect(page.getByRole('heading', { name: 'Showcase Night', exact: true })).toBeVisible();
});

test('attendee role shows discovery assistants and sample matches', async ({ page }) => {
  await page.goto('/agents');
  await page.getByTestId('role-attendee').click();
  await expect(page.getByTestId('discovery-intro')).toContainText('Discovery assistants');
  await expect(page.getByText('Neighborhood Scout')).toBeVisible();
  await expect(page.getByTestId('discovery-event-1')).toContainText('Saturday porch coffee');
});
