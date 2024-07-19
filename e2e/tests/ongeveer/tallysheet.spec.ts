import { test, expect } from '@playwright/test'
import { setUser } from '../../utils'

test('Table shows all tallysheets', async ({ page, context }) => {
	await setUser(context, 'financie')
	await page.goto('/ongeveer/sales/tallysheet')

	// Niet geprocessed

	// Begin datum
	await expect(page.getByRole('cell', { name: 'maandag 14 apr 2003 12:34', exact: true })).toBeVisible()
	// Eind datum
	await expect(page.getByRole('cell', { name: 'woensdag 16 apr 2003 12:34', exact: true })).toBeVisible()
	// Icon indicating the tallysheet is unprocessed. Format: {date}-unprocessed
	await expect(page.getByRole('cell', { name: '2003-04-14-unprocessed', exact: true })).toBeVisible()

	// Geprocessed

	// Begin datum
	await expect(page.getByRole('cell', { name: 'dinsdag 11 sep 2001 12:34', exact: true })).toBeVisible()
	// Eind datum
	await expect(page.getByRole('cell', { name: 'woensdag 12 sep 2001 12:34', exact: true })).toBeVisible()
	// Icon
	await expect(page.getByRole('cell', { name: '2001-09-11-processed', exact: true })).toBeVisible()
})
