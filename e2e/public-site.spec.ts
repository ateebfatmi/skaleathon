import { expect, test } from '@playwright/test';

const publicRoutes = ['/', '/tracks', '/prizes', '/rules', '/faq'];

test.describe('public website', () => {
  for (const route of publicRoutes) {
    test(`${route} renders without horizontal overflow`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('body')).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test('desktop navbar performs client-side navigation', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop navigation capsule is hidden on mobile.');
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const navigation = page.getByRole('navigation', { name: 'Main Navigation' });
    await Promise.all([
      page.waitForURL('**/tracks'),
      navigation.getByRole('link', { name: 'Tracks' }).click(),
    ]);

    await expect(page).toHaveURL(/\/tracks$/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('security headers are present', async ({ request }) => {
    const response = await request.get('/');
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.headers()['x-frame-options']).toBe('DENY');
    expect(response.headers()['content-security-policy']).toContain("default-src 'self'");
  });
});
