import db from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import Decimal from 'decimal.js';
import { env } from '$env/dynamic/public';
import { formatFileSize } from '$lib/utils';

export const load = (async ({ params }) => {
	const purchase = await db.journal.findUnique({
		where: { id: Number(params.id), type: 'PURCHASE' },
		include: {
			Rows: {
				include: {
					Ledger: {
						select: {
							name: true
						}
					}
				}
			},
			Treasurer: {
				select: {
					firstName: true
				}
			},
			Attachments: true
		}
	});
	if (!purchase) throw error(404, 'Aankoop niet gevonden');

	const attachments =
		purchase?.Attachments?.map((attatchment) => {
			return {
				MIMEtype: attatchment.MIMEtype,
				src: `${env.PUBLIC_UPLOAD_URL}purchases/${attatchment.filename}`,
				size: formatFileSize(attatchment.size),
				name: attatchment.filename
			};
		}) ?? [];

	const serializedRows = purchase.Rows.map((row) => ({
		...row,
		total: row.price.mul(row.amount).toNumber(),
		price: row.price.toNumber()
	}));
	return {
		purchase: {
			...purchase,
			Rows: serializedRows,
			total: purchase.Rows.reduce(
				(acc, row) => acc.add(row.price.mul(row.amount)),
				new Decimal(0)
			).toNumber()
		},
		attachments
	};
}) satisfies PageServerLoad;
