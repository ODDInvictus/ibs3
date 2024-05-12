import { test, expect } from '@playwright/test'
import { generateRandomString, setUser } from '../../utils'
import { prisma } from '../../db'
import { Decimal } from 'decimal.js'

async function getLidAndSenaat() {
	const lid = await prisma.financialPerson.findFirst({ where: { name: 'lid' } })
	const senaat = await prisma.financialPerson.findFirst({ where: { name: 'senaat' } })
	if (!lid || !senaat) throw new Error("Financial person 'lid' and/or 'senaat' not found")
	return { lid, senaat }
}

test('Manual transaction shows up in the table', async ({ page, context }) => {
	await setUser(context, 'financie')

	const amount = 123
	const description = `Test-${generateRandomString()}`

	const { lid: lidBefore, senaat: senaatBefore } = await getLidAndSenaat()

	await page.goto('/ongeveer/saldo/transactions/create')
	await page.getByTestId('giver-input').selectOption('lid')
	await page.getByTestId('receiver-input').selectOption('senaat')
	await page.getByTestId('amount-input').fill(amount.toString())
	await page.getByTestId('description-input').fill(description)
	await page.getByTestId('submit-btn').click()

	await page.goto('/ongeveer/saldo/transactions')
	await expect(page.getByRole('cell', { name: description })).toBeVisible()

	const { lid: lidAfter, senaat: senaatAfter } = await getLidAndSenaat()

	expect(lidBefore.balance.minus(lidAfter.balance).toNumber()).toEqual(amount)
	expect(senaatAfter.balance.minus(senaatBefore.balance).toNumber()).toEqual(amount)
})
