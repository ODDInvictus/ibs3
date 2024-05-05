import { test, expect } from '@playwright/test'
import { setUser } from '../utils'

test('Leden only zichtbaar voor leden', async ({ page, context }) => {
	await setUser(context, 'lid')
	await page.goto('/kalender')
	await expect(page.locator('[data-testId=activities] > .row')).toHaveCount(3)
})

test('Leden only niet zichtbaar voor feuten', async ({ page, context }) => {
	await setUser(context, 'feut')
	await page.goto('/kalender')
	await expect(page.locator('[data-testId=activities] > .row')).toHaveCount(2)
})
