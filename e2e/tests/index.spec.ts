import { test, expect } from '@playwright/test'

test('Next activity card', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByTestId('next-activity-name')).toContainText('Borrel')
})

test('Strafbakken card', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByTestId('strafbakken')).toContainText('0')
})
