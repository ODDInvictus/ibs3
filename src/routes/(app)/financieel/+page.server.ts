import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	const personData = await db.financialPersonDataUser.findFirst({
		where: {
			userId: locals.user.id,
		},
		include: {
			person: true,
		},
	})

	if (!personData) throw error(404, 'Geen financiële persoon gevonden voor user #' + locals.user.id)

	return {
		person: JSON.parse(JSON.stringify(personData.person)) as typeof personData.person,
	}
}
