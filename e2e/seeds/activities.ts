import { prisma } from '../db'

export async function seedActivities(users: { id: number }[]) {
	/* Activity locations */

	const locations = [
		{
			id: 1,
			name: 'De Kelder',
			adress: 'Kelderstraat 1',
			country: 'Nederland',
			postalCode: '7500AA',
			city: 'Enschede',
			description: 'Huts',
		},
		{
			id: 2,
			name: 'De Bastille',
			adress: 'De Hems 10',
			country: 'Nederland',
			postalCode: '7500AA',
			city: 'Enschede',
			description: 'Huts',
		},
	]

	await prisma.activityLocation.createMany({
		data: locations,
	})

	/* Activities */

	const activities = [
		{
			id: 1,
			name: 'Borrel',
			description: 'Gezellig borrelen',
			startTime: new Date('2044-01-01T21:00:00'),
			endTime: new Date('2044-01-01T21:00:00'),
			locationId: 2,
			committeeId: 1,
		},
		{
			id: 2,
			name: 'Alleen voor leden',
			description: 'Alleen voor leden',
			startTime: new Date('2044-01-01T21:00:00'),
			endTime: new Date('2044-01-01T23:55:00'),
			locationId: 1,
			committeeId: 7,
			membersOnly: true,
		},
		{
			id: 3,
			name: 'Feutendag',
			description: 'Feutendag',
			startTime: new Date('2044-01-01T21:00:00'),
			endTime: new Date('2044-01-01T23:55:00'),
			locationId: 1,
			committeeId: 4,
		},
	]

	await prisma.activity.createMany({
		data: activities,
	})

	/* Attending */

	const attending: {
		userId: number
		activityId: number
	}[] = []

	for (const user of users) {
		for (const activity of activities) {
			attending.push({
				userId: user.id,
				activityId: activity.id,
			})
		}
	}

	await prisma.attending.createMany({
		data: attending,
	})

	return { activities, attending, locations }
}
