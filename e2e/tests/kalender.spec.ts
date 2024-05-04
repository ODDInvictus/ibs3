import { test, expect } from '@playwright/test'

test('Leden only zichtbaar voor leden', async ({ page }) => {
	await page.goto('/kalender')
	await expect(page.locator('[data-testId=activities] > .row')).toHaveCount(3)
})

// TODO switch user
