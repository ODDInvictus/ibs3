import db from '$lib/server/db'

export const load = async () => {
	const locations = await db.activityLocation.findMany({
		where: {
			isActive: true,
		},
	})

	return {
		locations,
	}
}
