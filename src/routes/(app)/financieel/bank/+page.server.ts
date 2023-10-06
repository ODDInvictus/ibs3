import db from '$lib/server/db';
import { error, type Actions } from '@sveltejs/kit';
import { hasRole } from '$lib/server/authorization';
import { LDAP_IDS } from '$lib/constants';

const HEADERS = [
	'Type',
	'Product',
	'Started Date',
	'Completed Date',
	'Description',
	'Amount',
	'Fee'
] as const;

export const actions = {
	default: async ({ request, locals }) => {
		if (!hasRole(locals.user, LDAP_IDS.FINANCIE)) throw error(403);

		const formData = await request.formData();
		const file = formData.get('file') as File;
		const lines = (await file.text()).split('\n');
		const keys = lines.shift()?.split(',') ?? [];
		if (!HEADERS.every((header) => keys.includes(header))) throw error(400, 'Invalid file');
		const transactions: { [key: string]: string }[] = [];
		for (const row of lines) {
			if (row === '') continue; // skip empty lines (last line)
			const transaction: { [key: string]: string } = {};
			const values = row.split(',');
			for (let i = 0; i < keys.length; i++) {
				// @ts-expect-error
				if (!HEADERS.includes(keys[i])) continue; // skip unknown headers
				if (values[i] === undefined) throw error(400, 'Invalid file');
				transaction[keys[i]] = values[i];
			}
			transactions.push(transaction);
		}

		try {
			await Promise.all(
				transactions.map((transaction) => {
					const data = {
						type: transaction.Type,
						product: transaction.Product,
						startedDate: new Date(transaction['Started Date']).toISOString(),
						completedDate: new Date(transaction['Completed Date']).toISOString(),
						description: transaction.Description,
						amount: transaction.Amount,
						fee: transaction.Fee
					};

					return db.bankTransaction.upsert({
						where: {
							// @ts-expect-error
							type_product_startedDate_completedDate_description_amount_fee: data
						},
						// @ts-expect-error
						create: data,
						// @ts-expect-error
						update: data
					});
				})
			);
		} catch (e) {
			console.error(e);
			throw error(500);
		}

		return { status: 200 };
	}
} satisfies Actions;
