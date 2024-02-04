import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load = (async ({ url }) => {
	let p = Number(url.searchParams.get('p'));
	if (p < 0) p = 0;

	let size = Number(url.searchParams.get('size'));
	if (size <= 0) size = 20;

	const transactions = await db.saldoTransaction.findMany({
		take: size,
		skip: p * size,
		orderBy: {
			Transaction: {
				createdAt: 'desc'
			}
		},
		include: {
			Transaction: true,
			to: true,
			from: true
		}
	});

	return {
		transactions: JSON.parse(JSON.stringify(transactions)) as typeof transactions,
		p,
		size
	};
}) satisfies PageServerLoad;
