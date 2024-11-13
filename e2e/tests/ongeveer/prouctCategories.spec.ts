import { test, expect } from '@playwright/test'
import { generateRandomString, setUser } from '../../utils'
import { prisma } from '../../db'

test('Table shows all product categories', async ({ page, context }) => {
	await setUser(context, 'financie')
	await page.goto('/ongeveer/products/category')
	await expect(page.getByRole('cell', { name: 'Bier' })).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Eten' })).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Overig' })).toBeVisible()
})

test('Create product category', async ({ page, context }) => {
	await setUser(context, 'financie')

	const name = `Radler-${generateRandomString()}`

	await page.goto('/ongeveer/products/category/create')
	await page.getByTestId('name-input').fill(name)
	await page.getByTestId('description-input').fill('Test description')
	await page.getByTestId('submit-btn').click()

	await page.waitForURL(/\/ongeveer\/products\/category\/\d+/)
	await expect(page.getByRole('cell', { name, exact: true })).toBeVisible()
})

test('Delete product category', async ({ page, context }) => {
	await setUser(context, 'financie')

	const name = `Merch-${generateRandomString()}`

	const category = await prisma.productCategory.create({
		data: {
			name,
			description: 'Test Description',
		},
	})

	await page.goto(`/ongeveer/products/category/${category.id}`)
	page.on('dialog', async dialog => {
		await dialog.accept()
	})
	await page.getByTestId('delete-btn').click()
	await page.waitForURL('/ongeveer/products/category')
	expect(page.getByRole('cell', { name })).not.toBeVisible()
})

test('Can not delete product category with product that is used in journal', async ({ playwright, context }) => {
	await setUser(context, 'financie')

	const beerCategory = await prisma.productCategory.findFirst({
		where: { name: 'Bier' },
	})

	if (!beerCategory) {
		throw new Error("Category 'Bier' not found, but required to test product categories")
	}

	const apiContext = await playwright.request.newContext({
		baseURL: 'http://localhost:4173',
	})

	const res = await apiContext.delete(`/ongeveer/products/category/${beerCategory.id}`)
	expect(res.status()).toBe(409)
})
