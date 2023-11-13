import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import Decimal from 'decimal.js';

export const load = async ({ params, locals }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw error(404, `Declaratie ${params.id} niet gevonden`);

	const declaration = await db.invoice.findFirst({
		where: {
			id: id,
			type: 'DECLARATION',
			relation: {
				FinancialPersonDataUser: {
					userId: locals.user.id
				}
			}
		},
		include: {
			Rows: true,
			DeclarationData: true,
			Attachments: true
		}
	});

	if (!declaration) throw error(404, `Declaratie ${params.id} niet gevonden`);

	const data = {
		id: declaration.id,
		date: declaration.date,
		methodOfPayment: declaration.DeclarationData?.methodOfPayment ?? null,
		description: declaration.description,
		status: declaration.DeclarationData?.status ?? null,
		total: declaration.Rows.reduce(
			(acc, { price, amount }) => acc.add(new Decimal(price).mul(amount)),
			new Decimal(0)
		).toNumber(),
		Attachments: declaration.Attachments.map(({ id, filename, MIMEtype }) => ({
			id,
			filename,
			MIMEtype
		}))
	};

	return { declaration: data };
};
