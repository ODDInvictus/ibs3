import db from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Loads a sale invoice by ID, including related data.
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the sale invoice to load.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the loaded invoice data.
 * @throws {Error} - Throws an error if the ID is not a number, or if the invoice is not found.
 */
export default (async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400);

	const invoice = await db.saleInvoice.findUnique({
		where: { id },
		include: {
			rows: true,
			to: {
				include: {
					FinancialPersonDataOther: true,
					FinancialPersonDataUser: {
						include: {
							user: true
						}
					}
				}
			},
			treasurer: {
				select: {
					firstName: true,
					lastName: true
				}
			}
		}
	});

	if (!invoice) throw error(404);
	if (!invoice.date) throw redirect(300, `/financieel/sales/create?id=${id}`);

	return {
		invoice: JSON.parse(JSON.stringify(invoice))
	};
}) satisfies PageServerLoad;
