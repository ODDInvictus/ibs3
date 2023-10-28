import { authorization } from '$lib/ongeveer/utils';
import db from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) return new Response(null, { status: 400 });

	if (!authorization(locals.roles)) return new Response(null, { status: 403 });

	const relation = await db.financialPerson.findUnique({
		where: { id, type: 'OTHER' },
		select: {
			_count: {
				select: {
					Invoice: true,
					BankTransactionFrom: true,
					Sale: true,
					Acquisition: true,
					TransactionFrom: true,
					TransactionTo: true,
					Streeplijst: true
				}
			}
		}
	});

	if (!relation) return new Response(null, { status: 404 });

	if (Object.values(relation._count).some((count: number) => count > 0)) {
		return new Response(null, { status: 409 });
	}

	await db.financialPerson.delete({ where: { id } });

	return new Response(null, { status: 200 });
};

export const PATCH: RequestHandler = async ({ params, locals }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) return new Response(null, { status: 400 });

	if (!authorization(locals.roles)) return new Response(null, { status: 403 });

	const relation = await db.financialPerson.findUnique({
		where: { id, type: 'OTHER' }
	});

	if (!relation) return new Response(null, { status: 404 });

	await db.financialPerson.update({
		where: { id },
		data: {
			isActive: !relation.isActive
		}
	});

	return new Response(null, { status: 200 });
};
