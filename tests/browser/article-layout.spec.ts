import { expect, test } from '@playwright/test';

for (const width of [320, 390, 1440]) {
  test(`offline guide fits a ${width}px viewport with a reachable results table`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/articles/test-browser-calculator-offline/');
    await page.evaluate(() => document.fonts.ready);

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for (const selector of ['.article-title', 'h1', '.article-intro', '.article-rail', '.article-content', '.article-content p', '.article-table']) {
      for (const element of await page.locator(selector).all()) {
        const bounds = await element.boundingBox();
        expect(bounds, selector).not.toBeNull();
        expect(bounds!.x, selector).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width, selector).toBeLessThanOrEqual(width + 1);
      }
    }

    const region = page.getByRole('region', { name: /results/ });
    await expect(region.getByRole('columnheader')).toHaveCount(3);
    await expect(region.locator('tbody tr')).toHaveCount(6);
    await region.focus();
    await expect(region).toBeFocused();
    const sizes = await region.evaluate(element => ({ client: element.clientWidth, scroll: element.scrollWidth }));
    if (sizes.scroll > sizes.client) {
      // Native scrolling must work with both keyboard and horizontal wheel input.
      await page.keyboard.press('ArrowRight');
      await expect.poll(() => region.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
      await region.evaluate(element => { element.scrollLeft = element.scrollWidth; });
      const lastCell = await region.locator('tr').last().locator('td').last().boundingBox();
      const viewport = await region.boundingBox();
      expect(lastCell!.x + lastCell!.width).toBeLessThanOrEqual(viewport!.x + viewport!.width + 1);
      await region.evaluate(element => { element.scrollLeft = 0; });
      const firstCell = await region.getByRole('columnheader').first().boundingBox();
      expect(firstCell!.x).toBeGreaterThanOrEqual(viewport!.x - 1);
      await region.hover();
      await page.mouse.wheel(160, 0);
      await expect.poll(() => region.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
