import { test, expect } from '@playwright/test'
import { setUser } from '../../utils'

test('Only financie, senaat and admins can access the ongeveer page', async ({ page, context }) => {
	await setUser(context, 'financie')
	await page.goto('/ongeveer')
	expect(page.url()).toContain('/ongeveer')

	await setUser(context, 'senaat')
	await page.goto('/ongeveer')
	expect(page.url()).toContain('/ongeveer')

	await setUser(context, 'admin')
	await page.goto('/ongeveer')
	expect(page.url()).toContain('/ongeveer')

	await setUser(context, 'lid')
	await page.goto('/ongeveer')
	expect(page.url()).not.toContain('/ongeveer')

	await setUser(context, 'feut')
	await page.goto('/ongeveer')
	expect(page.url()).not.toContain('/ongeveer')

	await setUser(context, 'colosseum')
	await page.goto('/ongeveer')
	expect(page.url()).not.toContain('/ongeveer')
})
