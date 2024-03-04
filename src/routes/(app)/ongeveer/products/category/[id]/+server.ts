import db from '$lib/server/db';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) return new Response('Invalid id', { status: 400 });

	const productCategory = await db.productCategory.findUnique({
		where: { id },
		select: {
			Product: {
				select: {
					_count: {
						select: {
							JournalRow: true
						}
					}
				}
			}
		}
	});

	if (!productCategory) return new Response('ProductCategory not found', { status: 404 });

	if (productCategory.Product.some((p) => p._count?.JournalRow ?? -1 > 0)) {
		return new Response(
			'Kan categorie niet verwijderen, omdat tenmisnte 1 product gebruikt wordt in een boekstuk',
			{ status: 409 }
		);
	}

	await db.product.deleteMany({ where: { categoryId: id } });
	await db.productCategory.delete({ where: { id } });

	return new Response();
};
