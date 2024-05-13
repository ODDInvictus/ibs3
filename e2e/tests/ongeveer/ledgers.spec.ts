import { test, expect } from '@playwright/test'
import { generateRandomString, setUser } from '../../utils'
import { prisma } from '../../db'

test('Table shows all ledgers', async ({ page, context }) => {
	await setUser(context, 'financie')
	await page.goto('/ongeveer/ledger')
	await expect(page.getByRole('cell', { name: 'Uitgaven declaraties generiek', exact: true })).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Inkomsten verkoop generiek', exact: true })).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Inkomsten verkoop bier', exact: true })).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Inkomsten verkoop eten', exact: true })).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Cantus', exact: true })).toBeVisible()
})

async function getRandomId() {
	let id = Math.floor(Math.random() * 1000)
	while (await prisma.ledger.findUnique({ where: { id } })) {
		id = Math.floor(Math.random() * 1000)
	}
	return id
}

test('Create ledger', async ({ page, context }) => {
	await setUser(context, 'financie')

	const name = `Ledger-${generateRandomString()}`
	const id = await getRandomId()

	await page.goto('/ongeveer/ledger')
	await page.getByTestId('add-ledger-btn').click()
	await page.getByTestId('id-input').fill(id.toString())
	await page.getByTestId('name-input').fill(name)
	await page.getByTestId('description-input').fill('Test description')
	await page.getByTestId('submit-btn').click()

	// Page reloads...
	await expect(page.getByRole('cell', { name, exact: true })).toBeVisible({ timeout: 10000 })
	await expect(page.getByRole('cell', { name: id.toString(), exact: true })).toBeVisible({ timeout: 10000 })
})

test('Delete ledger', async ({ page, context }) => {
	await setUser(context, 'financie')

	// Create new ledger
	const name = `Ledger-${generateRandomString()}`
	const id = await getRandomId()
	await prisma.ledger.create({
		data: {
			id,
			name,
			description: 'Test Description',
		},
	})

	await page.goto(`/ongeveer/ledger/${id}`)
	page.on('dialog', async dialog => {
		await dialog.accept()
	})
	await page.getByTestId('delete-btn').click()
	await page.waitForURL('/ongeveer/ledger')
	expect(page.getByRole('cell', { name, exact: true })).not.toBeVisible()
	expect(page.getByRole('cell', { name: id.toString(), exact: true })).not.toBeVisible()
})

test('Can not delete ledger with journal', async ({ playwright, context, page }) => {
	await setUser(context, 'financie')

	const cantus = await prisma.ledger.findFirst({
		where: { name: 'Cantus' },
	})

	if (!cantus) {
		throw new Error("Ledger 'Cantus' not found, but required to test ledgers")
	}

	const apiContext = await playwright.request.newContext({
		baseURL: 'http://localhost:4173',
	})

	const res = await apiContext.delete(`/ongeveer/ledger/${cantus.id}`)
	expect(res.status()).toBe(409)
})
