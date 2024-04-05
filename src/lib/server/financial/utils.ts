import db from '$lib/server/db'
import type { FinancialPerson } from '@prisma/client'

export const getFinancialPeoplePerCategory = async () => {
	const fp = await db.financialPerson.findMany({
		where: { isActive: true },
	})

	const financialPeople: { [key: string]: FinancialPerson[] } = {}

	for (const person of fp) {
		const arr = financialPeople[person.type] || []
		arr.push(person)
		financialPeople[person.type] = arr
	}

	return financialPeople
}
