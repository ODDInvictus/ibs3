import db from '$lib/server/db'

export const getFinancialPeoplePerCategory = async () => {
  const fp = await db.financialPerson.findMany({
    where: { isActive: true }
  })

  const financialPeople = {}

  for (const person of fp) {
    const arr = financialPeople[person.type] || []
    arr.push(person)
    financialPeople[person.type] = arr
  }

  return financialPeople
}