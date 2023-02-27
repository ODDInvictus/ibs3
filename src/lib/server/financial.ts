import db from '$lib/server/db'


export async function getFinancialPeople() {
  return await db.financialPerson.findMany({
    where: {
      isActive: true
    }
  })
}

export async function getProducts() {
  return await db.product.findMany({
    where: {
      isActive: true
    }
  })
}