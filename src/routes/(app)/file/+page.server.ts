import type { Actions } from './$types';
import { uploadFile } from '$lib/server/mongo';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const schmea = z.object({});

export const load = async ({ locals }) => {
	if (!locals.roles['ibs-admins']) {
		throw redirect(301, '/');
	}

	const form = await superValidate(schmea);

	return { form };
};

/**
 * Deze pagina is een voorbeeld van een pagina die een bestand upload en superforms gebruikt.
 */

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, schmea);
		if (!form.valid) {
			fail(400, { form });
		}

		// Other fields are accessible in form.data

		const file = formData.get('file') as File;
		const name = await uploadFile(file);

		return { form, name };
	}
} satisfies Actions;
