import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// TODO fix type for role to be Role instead of string
	if (
		!Object.entries<boolean>(locals.roles).some(
			([role, status]) =>
				(role === 'ibs-admins' || role === 'senaat' || role === 'financie') && status
		)
	)
		throw error(403, 'Alleen senaat en financie kunnen deze pagina zien');
}) satisfies LayoutServerLoad;
