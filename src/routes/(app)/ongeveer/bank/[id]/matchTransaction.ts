import { Roles } from '$lib/constants';
import { Form, type Field } from '$lib/form/form-generator';
import db from '$lib/server/db';
import { FINANCIAL_PERSON_IDS } from '$lib/constants';
import { error } from '@sveltejs/kit';
import { Decimal } from 'decimal.js';

type row = {
	description?: string;
	amount: number;
	invoice?: string;
	saldo: boolean;
	ledger: string;
};

export const matchForm = new Form<{
	ref?: string;
	relation?: string;
	id: string;
	rows: row[];
}>({
	title: 'Matchen',
	logic: async (data) => {
		const bankTransaction = await db.bankTransaction.findUnique({
			where: { id: Number(data.id) },
			include: { BankTransactionMatchRow: true }
		});
		if (!bankTransaction) throw error(404, 'Bank transaction not found');
		const { type, BankTransactionMatchRow } = bankTransaction;

		// Check if there is a relation if required
		if (!data.relation && data.rows.some((r) => r.saldo))
			return {
				success: false,
				message: `Je moet een relatie selecteren om het saldo ${
					type === 'TOPUP' ? 'aan toe te voegen' : 'van af te halen'
				}.`,
				status: 400
			};

		if (BankTransactionMatchRow.some((r) => r.transactionId))
			return {
				success: false,
				status: 400,
				message:
					'Je kan deze banktransactie niet meer veranderen, omdat er bij deze transactie saldo is toegevoegd of afgehaald. Maak een handmatige transactie om dit op te lossen.'
			};

		// Check if all amounts match
		const totalAmount = data.rows.reduce((sum, row) => {
			console.log(row.amount);
			return sum.add(new Decimal(row.amount));
		}, new Decimal(0));

		if (!totalAmount.equals(bankTransaction.amount))
			return {
				success: false,
				message: `De totale hoeveelheid van de match rows (${totalAmount}) komt niet overeen met de hoeveelheid van de banktransactie (${bankTransaction.amount}).`,
				status: 400
			};

		// Check if there are conflicting rows
		if (data.rows.some((row) => row.invoice && row.saldo))
			return {
				success: false,
				message: 'Je kan geen factuur matchen en saldo toevoegen in dezelfde match row.',
				status: 400
			};

		// Create transactions to change saldo
		await Promise.all(
			data.rows.map((row) => {
				if (!row.saldo) return;
				return db.transaction.create({
					data: {
						price: row.amount,
						description:
							row.description ??
							`Saldo ${type === 'TOPUP' ? 'toegevoegd' : 'verminderd'} van banktransactie ${
								data.id
							}`,
						toId: type === 'TOPUP' ? Number(data.relation) : FINANCIAL_PERSON_IDS.INVICTUS,
						fromId: type !== 'TOPUP' ? Number(data.relation) : FINANCIAL_PERSON_IDS.INVICTUS,
						ledgerId: row.ledger ? Number(row.ledger) : undefined
					}
				});
			})
		);

		// TODO prevent saldo transaction if relation is not of type user?

		// Update relation and reference
		await db.bankTransaction.update({
			where: { id: Number(data.id) },
			data: {
				ref: data.ref,
				relationId: data.relation ? Number(data.relation) : undefined
			}
		});

		// Reset match rows
		await db.bankTransactionMatchRow.deleteMany({
			where: { bankTransactionId: Number(data.id) }
		});

		await Promise.all(
			data.rows.map((row) => {
				return db.bankTransactionMatchRow.create({
					data: {
						description: row.description,
						amount: row.amount,
						bankTransactionId: Number(data.id),
						journalId: row.invoice ? Number(row.invoice) : undefined,
						ledgerId: Number(row.ledger)
					}
				});
			})
		);

		return {
			success: true,
			message: 'Bank transactie gematchet, je wordt nu doorgestuurd.',
			status: 200,
			redirectTo: '/ongeveer/bank'
		};
	},
	requiredRoles: [Roles.Admins, Roles.FinanCie, Roles.Senaat],
	formId: 'match-banktransaction-form',
	submitStr: 'Match',
	fields: [
		{
			name: 'ref',
			label: 'Referentie',
			type: 'text',
			optional: true
		} as Field<'text'>,
		{
			name: 'relation',
			label: 'Relatie',
			type: 'select',
			getOptions: async () => {
				const relations = await db.financialPerson.findMany({
					where: { OR: [{ type: 'OTHER' }, { type: 'USER' }], isActive: true }
				});

				return relations.map((relation) => ({
					label: `${relation.id} - ${relation.name}`,
					value: relation.id
				}));
			},
			optional: true
		} as Field<'select'>,
		{
			type: 'table',
			name: 'rows',
			label: '',
			columns: [
				{
					name: 'description',
					label: 'Beschrijvings',
					type: 'text',
					optional: true
				},
				{
					name: 'amount',
					type: 'number',
					label: 'Bedrag',
					minValue: 0,
					step: 0.01
				},
				{
					name: 'saleInvoice',
					label: 'Factuur',
					type: 'select',
					getOptions: async () => {
						// TODO filter
						const journals = await db.journal.findMany();

						return journals.map((journal) => ({
							label: `${journal.id} - ${journal.ref ?? ''}`,
							value: journal.id
						}));
					},
					optional: true
				},
				{
					name: 'saldo',
					label: 'Voeg toe aan saldo',
					type: 'checkbox'
				},
				{
					name: 'ledger',
					label: 'Grootboek',
					type: 'select',
					getOptions: async () => {
						const ledgers = await db.ledger.findMany({
							where: { isActive: true }
						});

						return ledgers.map((ledger) => ({
							label: `${ledger.id} - ${ledger.name}`,
							value: ledger.id
						}));
					}
				}
			]
		},
		{
			name: 'id',
			type: 'hidden'
		} as Field<'hidden'>
	]
});
