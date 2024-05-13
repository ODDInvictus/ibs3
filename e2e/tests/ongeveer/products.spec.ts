import { test, expect } from '@playwright/test'
import { generateRandomString, setUser } from '../../utils'
import { prisma } from '../../db'

test('Table shows all products', async ({ page, context }) => {
	await setUser(context, 'financie')
	await page.goto('/ongeveer/products')
	await expect(page.getByRole('cell', { name: 'Grolsch pijpje' })).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Frikandel' })).toBeVisible()
})

test('Create product', async ({ page, context }) => {
	await setUser(context, 'financie')

	const name = `Veltins-${generateRandomString()}`

	await page.goto('/ongeveer/products/create')
	await page.getByTestId('name-input').fill(name)
	await page.getByTestId('description-input').fill('Test description')
	await page.getByTestId('price-input').fill('1.23')
	await page.getByTestId('categoryId-input').selectOption('Bier')
	await page.getByTestId('productType-input').selectOption('Alcohol-houdend')
	await page.getByTestId('submit-btn').click()

	await page.waitForURL(/\/ongeveer\/products\/\d+/)
	await expect(page.getByRole('cell', { name, exact: true })).toBeVisible()
})

test('Delete product', async ({ page, context }) => {
	await setUser(context, 'financie')

	const productCategory = await prisma.productCategory.findFirst({
		where: { name: 'Overig' },
	})

	if (!productCategory) {
		throw new Error("Category 'Overig' not found, but required to test products")
	}

	const name = `Warsteiner-${generateRandomString()}`

	const product = await prisma.product.create({
		data: {
			name,
			description: 'Test Description',
			price: 9.99,
			productType: 'OTHER',
			categoryId: productCategory.id,
			data: {},
		},
	})

	await page.goto(`/ongeveer/products/${product.id}`)
	page.on('dialog', async dialog => {
		await dialog.accept()
	})
	await page.getByTestId('delete-btn').click()
	await page.waitForURL('/ongeveer/products')
	expect(page.getByRole('cell', { name })).not.toBeVisible()
})

test('Can not delete product used in journal', async ({ playwright, context }) => {
	await setUser(context, 'financie')

	const grolschPijpje = await prisma.product.findFirst({
		where: { name: 'Grolsch pijpje' },
	})

	if (!grolschPijpje) {
		throw new Error("Product 'Grolsch pijpje' not found, but required to test products")
	}

	const apiContext = await playwright.request.newContext({
		baseURL: 'http://localhost:4173',
	})

	const res = await apiContext.delete(`/ongeveer/products/${grolschPijpje.id}`)
	expect(res.status()).toBe(409)
})
