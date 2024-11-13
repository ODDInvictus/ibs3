import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import { setUser } from '../../utils'
import type { userTypesType } from '../../utils'

async function testAuthorization(page: Page, context: BrowserContext, role: userTypesType, expectPermission: boolean) {
	await setUser(context, role)
	await page.goto('/ongeveer')
	if (expectPermission) {
		expect(page.url()).toContain('/ongeveer')
	} else {
		await expect(page.getByText('Alleen senaat en financie kunnen deze pagina zien')).toBeVisible()
	}
}

test('Financie, senaat and admins can access the ongeveer page', async ({ page, context }) => {
	await testAuthorization(page, context, 'financie', true)
	await testAuthorization(page, context, 'senaat', true)
	await testAuthorization(page, context, 'admin', true)
})

test('Lid, feut and colosseum cannot access the ongeveer page', async ({ page, context }) => {
	await testAuthorization(page, context, 'lid', false)
	await testAuthorization(page, context, 'feut', false)
	await testAuthorization(page, context, 'colosseum', false)
})
