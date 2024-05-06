import { test, expect } from '@playwright/test'
import { generateRandomString, setUser } from '../../utils'
import { prisma } from '../../db'

test('Table shows all relations of type other', async ({ page, context }) => {
	await setUser(context, 'financie')
	await page.goto('/ongeveer/relations')
	await expect(page.getByRole('cell', { name: 'I.C.T.S.V. Inter-Actief' })).toBeVisible()
})

test('Create new relation', async ({ page, context }) => {
	await setUser(context, 'financie')
	const name = `Vestingbar-${generateRandomString()}` // We need names to be unique, so playwright can test different browsers in parallel
	await page.goto('/ongeveer/relations/create')
	await page.getByTestId('name-input').fill(name)
	await page.getByTestId('submit-btn').click()
	await page.waitForURL('/ongeveer/relations')
	await expect(page.getByRole('cell', { name })).toBeVisible()
	await prisma.financialPerson.deleteMany({ where: { name } })
})

test('Can delete unused relation', async ({ page, context }) => {
	await setUser(context, 'financie')
	const name = `Scintilla-${generateRandomString()}` // We need names to be unique, so playwright can test different browsers in parallel
	const { id } = await prisma.financialPerson.create({
		data: {
			name,
			type: 'OTHER',
			FinancialPersonDataOther: {
				create: {
					description: 'Een andere vereniging',
				},
			},
		},
	})
	await page.goto(`/ongeveer/relations/${id}`)
	await page.getByTestId('delete-btn').click()
	await page.waitForURL('/ongeveer/relations')
	await expect(page.getByRole('cell', { name })).not.toBeVisible()
})

test('Can not delete used relation', async ({ page, context, playwright }) => {
	await setUser(context, 'financie')
	const interActief = await prisma.financialPerson.findFirst({ where: { name: 'I.C.T.S.V. Inter-Actief' }, select: { id: true } })
	if (!interActief) throw new Error('Financial person Inter-Actief not found')
	await page.goto(`/ongeveer/relations/${interActief.id}`)
	await expect(page.getByTestId('delete-btn')).toBeDisabled()

	const apiContext = await playwright.request.newContext({
		baseURL: 'http://localhost:4173',
	})

	const res = await apiContext.delete(`/ongeveer/relations/${interActief.id}`)
	expect(res.status()).toBe(409)
})

test('Can not delete relation of type user', async ({ page, context, playwright }) => {
	await setUser(context, 'financie')
	const user = await prisma.financialPerson.findFirst({ where: { type: 'USER' }, select: { id: true } })
	if (!user) throw new Error('User not found')
	await page.goto(`/ongeveer/relations/${user.id}`)
	await expect(page.getByTestId('delete-btn')).toBeDisabled()

	const apiContext = await playwright.request.newContext({
		baseURL: 'http://localhost:4173',
	})

	const res = await apiContext.delete(`/ongeveer/relations/${user.id}`)
	expect(res.status()).toBe(409)
})
