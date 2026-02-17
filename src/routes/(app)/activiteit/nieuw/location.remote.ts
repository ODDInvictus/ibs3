import { form, query } from '$app/server'
import { db } from '$lib/server/db'
import { invalid } from '@sveltejs/kit'
import { z } from 'zod'

export const searchLocation = query(z.string(), async (query: string): Promise<{ name: string; id: number }[]> => {
	return await db.activityLocation.findMany({
		take: 1,
		where: {
			isActive: true,
			name: {
				search: `${query.trim().toLowerCase()}*`,
			},
		},
		select: {
			name: true,
			id: true,
		},
	})
})

type NewLocation = {
	name: string
	description: string
	adress?: string
	postalCode?: string
	city?: string
	country: string
}

const locationSchema = z.object({
	name: z.string().min(3, { message: 'Naam moet minstens 3 karakters lang zijn' }),
	description: z.string().min(3, { message: 'Omschrijving moet minstens 3 karakters lang zijn' }),
	adress: z.string().optional(),
	postalCode: z.string().optional(),
	city: z.string().optional(),
	country: z.string().optional().default('Nederland'),
})

export const saveLocation = form(locationSchema, async (loc: NewLocation) => {
	const newLoc = await db.activityLocation.create({
		data: {
			...loc,
		},
	})
	return newLoc.id
})
