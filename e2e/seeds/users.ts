import { prisma } from '../seed'
import { userTypes } from '../utils'

export async function seedUsers() {
	/* User */

	const users = userTypes.map((username, i) => ({
		id: i + 1,
		isActive: true,
		firstName: username,
		lastName: 'Test',
		ldapId: `user-${i + 1}-${username}`,
		email: `user-${i + 1}@example.com`,
		personalEmail: `user-${i + 1}@personal.example.com`,
		nickname: username,
		birthDate: new Date('2000-01-01'),
		phone: '0601010101',
		firstDrink: new Date('2021-01-01'),
		becameFeut: new Date('2021-01-02'),
		becameMember: new Date('2021-01-03'),
		lastLoggedin: new Date(),
		preferredTheme: 'light',
	}))

	await prisma.user.createMany({
		data: users,
	})

	/* Account */

	const accounts = users.map(user => ({
		id: `FILL-IN-${user.id}`,
		userId: user.id,
		type: 'oidc',
		provider: 'authentik',
		providerAccountId: `FILL-IN-${user.id}`,
	}))

	await prisma.account.createMany({
		data: accounts,
	})

	return { users, accounts }
}
