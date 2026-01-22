import { Preference, User } from './prisma/client'
import { prisma } from './prisma'

type PreferenceReturn = Preference & {
	user: User
}

function log(...args: unknown[]) {
	console.log('[PREFERENCE]', ...args)
}

export async function getPreference(key: string, membersOnly = false): Promise<PreferenceReturn[]> {
	// first get the base
	const base = await prisma.basePreference.findFirst({
		where: {
			key,
		},
	})

	if (!base) {
		log('No preferences found for key', key)
		return []
	}

	// Then check if the key exists for all users
	const preferences = await prisma.preference.findMany({
		where: {
			baseId: base.id,
			user: {
				isActive: true,
			},
		},
		include: {
			user: true,
		},
	})

	// Now get all users to see if we need to create more objects
	const users = await prisma.user.findMany({
		where: {
			isActive: true,
		},
	})

	if (preferences.length !== users.length) {
		// Create the missing objects
		await prisma.$transaction(async tx => {
			for (const user of users) {
				// Check if the user already has a preference for this key
				const userPreference = preferences.find(preference => preference.userId === user.id)

				if (!userPreference) {
					log(`Creating preference object for user ${user.ldapId} with key ${key}`)

					// Create the preference
					await tx.preference.create({
						data: {
							baseId: base.id,
							value: base.defaultValue,
							userId: user.id,
						},
					})
				}
			}
		})
	}

	if (membersOnly) {
		return await prisma.preference.findMany({
			where: {
				baseId: base.id,
				value: true,
				user: {
					CommitteeMember: {
						some: {
							committee: {
								ldapId: 'leden',
							},
						},
					},
				},
			},
			include: {
				user: true,
			},
		})
	} else {
		return await prisma.preference.findMany({
			where: {
				baseId: base.id,
				value: true,
			},
			include: {
				user: true,
			},
		})
	}
}
