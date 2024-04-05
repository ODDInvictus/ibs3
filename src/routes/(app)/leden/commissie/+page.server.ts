import db from '$lib/server/db'

export const load = async () => {
	const count = await db.committeeMember.groupBy({
		by: ['committeeId'],
		where: {
			committee: {
				isActive: true,
			},
		},
		_count: {
			committeeId: true,
		},
	})

	const committees = await db.committee.findMany({
		where: { isActive: true },
	})

	const inactive = await db.committee.findMany({
		where: { isActive: false },
	})

	return {
		committees: [...committees, ...inactive],
		count,
	}
}
