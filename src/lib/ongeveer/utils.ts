import type { UserRoles } from '$lib/constants'

// TODO fix type of role to be Role instead of string
export const authorization = (roles: UserRoles) =>
	Object.entries<boolean>(roles).some(([role, status]) => (role === 'ibs-admins' || role === 'senaat' || role === 'financie') && status)
