import { authorization } from '$lib/ongeveer/utils';
import db from '$lib/server/db';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const ledgerId = Number(params.id);
	if (Number.isNaN(ledgerId)) return new Response(null, { status: 400 });

	if (!authorization(locals.roles)) return new Response(null, { status: 403 });

	const ledger = await db.ledger.findUnique({
		where: { id: ledgerId },
		select: {
			_count: {
				select: {
					JournalRows: true
				}
			}
		}
	});

	if (!ledger) return new Response(null, { status: 404 });

	if (ledger._count.JournalRows > 0) {
		return new Response('Kan grootboek niet verwijderen, omdat hij niet leeg is', { status: 409 });
	}

	await db.ledger.delete({ where: { id: ledgerId } });

	return new Response(null, { status: 200 });
};

// Toggle soft delete
export const PATCH: RequestHandler = async ({ params, locals }) => {
	const ledgerId = Number(params.id);
	if (Number.isNaN(ledgerId)) return new Response(null, { status: 400 });

	if (!authorization(locals.roles)) return new Response(null, { status: 403 });

	const ledger = await db.ledger.findUnique({
		where: { id: ledgerId }
	});

	if (!ledger) return new Response(null, { status: 404 });

	await db.ledger.update({
		where: { id: ledgerId },
		data: {
			isActive: !ledger.isActive
		}
	});

	return new Response(null, { status: 200 });
};
