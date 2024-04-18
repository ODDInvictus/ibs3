import { test, expect } from '@playwright/test'

test('test auth page', async ({ page }) => {
	await page.goto('/auth')

	await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
	await page.getByRole('button', { name: 'Registreer' }).click()
	await expect(page.getByRole('heading', { name: 'Registreer' })).toBeVisible()
	await page.getByRole('button', { name: 'Login' }).click()

	await expect(page.getByRole('button', { name: 'Backdoor' })).toBeVisible()
	await page.getByRole('button', { name: 'Backdoor' }).click()
	expect(page.url()).toMatch(/^https:\/\/((www)|m)\.youtube\.com\/watch\?v=ENXvZ9YRjbo$/)
})
