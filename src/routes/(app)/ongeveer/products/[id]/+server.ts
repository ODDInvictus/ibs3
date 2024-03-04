import db from '$lib/server/db';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (!id) throw new Error('Invalid id');

	const product = await db.product.findUnique({
		where: { id },
		select: {
			_count: {
				select: {
					JournalRow: true
				}
			}
		}
	});

	if (!product) {
		return new Response('Product niet gevonden', { status: 404 });
	}

	if (product._count?.JournalRow ?? -1 > 0) {
		return new Response(
			'Kan dit product niet verwijderen, omdat hij gebruikt wordt in een boekstuk',
			{ status: 409 }
		);
	}

	await db.product.delete({ where: { id } });

	return new Response(null, { status: 200 });
};
