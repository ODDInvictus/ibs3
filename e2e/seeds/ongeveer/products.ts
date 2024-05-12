import { ProductCategory } from '@prisma/client'
import { prisma } from '../../db'

export async function seedProductCategories() {
	const data = [
		{
			name: 'Bier',
			description: 'Bier',
		},
		{
			name: 'Eten',
			description: 'Eten',
		},
		{
			name: 'Overig',
			description: 'Overig',
		},
	] as const

	const categoriesPromises = data.map(category => {
		return prisma.productCategory.create({
			data: category,
		})
	})

	const productCategories = await Promise.all(categoriesPromises)

	return { productCategories }
}

export async function seedProducts(categories: ProductCategory[]) {
	const beerCategory = categories.find(c => c.name === 'Bier')
	const foodCategory = categories.find(c => c.name === 'Eten')
	if (!beerCategory || !foodCategory) {
		throw new Error("Categories 'bier' and 'eten' not found, but required to seed products")
	}

	const products = await prisma.product.createMany({
		data: [
			{
				name: 'Grolsch pijpje',
				description: 'Groslch premium pilsner 0.3L',
				price: 1.5,
				categoryId: beerCategory.id,
				data: {},
			},
			{
				name: 'Frikandel',
				description: 'Frikandel',
				price: 1.0,
				categoryId: foodCategory.id,
				data: {},
			},
		],
	})

	return { products }
}
