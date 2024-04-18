import { test, expect } from '@playwright/test'
import { loginTestUser } from '../utils/loginUser'

test.beforeEach(async ({ context }) => {
	await loginTestUser(context, 'lid')
})

test('test header', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByText('home admin Test Admin')).toBeVisible()
	await expect(page.getByRole('main')).toContainText('admin Test')
	await expect(page.getByRole('main')).toContainText('home')
	await expect(page.getByRole('main')).toContainText('Admin')
})

test('test birthdays', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByRole('main')).toContainText('Volgende jarige: admin')
	await page.getByRole('link', { name: 'Wie zijn er nog meer' }).click()
	await expect(page.getByRole('main')).toContainText(
		'Verjaardagen Naam Geboortedatum Toekomstige leeftijd Hoeveel dagen nog admin Test (admin) 1 januari 25 270 colosseum Test (colosseum) 1 januari 25 270 feut Test (feut) 1 januari 25 270 financie Test (financie) 1 januari 25 270 senaat Test (senaat) 1 januari 25 270 lid Test (lid) 1 januari 25 270',
	)
})

test('test activity card', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByRole('main')).toContainText('Borrel')
})
