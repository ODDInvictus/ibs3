import { getInvoiceStatus } from '$lib/ongeveer/db';
import { authorization } from '$lib/ongeveer/utils';
import db from '$lib/server/db';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) return new Response('ID is geen nummer', { status: 400 });

	if (!authorization(locals.roles))
		return new Response('Je moet senaat of financie zijn', { status: 403 });

	try {
		var status: Awaited<ReturnType<typeof getInvoiceStatus>> = await getInvoiceStatus(id);
	} catch (error) {
		console.error(error);
		return new Response('Kan de status van de aankoop niet verkrijgen', { status: 500 });
	}
	if (!status) return new Response(null, { status: 404 });
	if (status === 'PAID')
		return new Response(
			'Aankoop is gematched aan een banktransactie, unmatch de banktransactie voor je de aankoop kan verwijderen',
			{ status: 409 }
		);

	try {
		await db.invoice.delete({ where: { id } });
	} catch (error) {
		console.error(error);
		return new Response('Kan de aankoop niet verwijderen', { status: 500 });
	}

	// TODO delete attachments

	return new Response(null, { status: 200 });
};
