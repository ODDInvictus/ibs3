import { Roles } from '$lib/constants';
import { Form, type Field } from '$lib/form/form-generator';
import db from '$lib/server/db';
import { FINANCIAL_PERSON_IDS } from '$lib/constants';
import { error } from '@sveltejs/kit';
import type { Transaction } from '@prisma/client';
import Decimal from 'decimal.js';

type row = {
	description?: string;
	amount: number;
	saldo: boolean;
	journal: string;
};

export const matchForm = new Form<{
	ref?: string;
	relation?: string;
	id: string;
	rows: row[];
}>({
	title: 'Matchen',
	logic: async (data) => {
		const bankTransactionId = Number(data.id);
		const bankTransaction = await db.bankTransaction.findUnique({
			where: { id: bankTransactionId },
			include: {
				Transaction: {
					include: {
						TransactionMatchRow: true
					}
				}
			}
		});
		if (!bankTransaction) throw error(404, 'Bank transaction not found');
		const {
			type,
			Transaction: { TransactionMatchRow }
		} = bankTransaction;

		// Check if there is a relation if required
		if (!data.relation && data.rows.some((r) => r.saldo))
			return {
				success: false,
				message: `Je moet een relatie selecteren om het saldo ${
					type === 'TOPUP' ? 'aan toe te voegen' : 'van af te halen'
				}.`,
				status: 400
			};

		// Check if the bank transaction is already matched to a saldo transaction
		if (TransactionMatchRow.some((r) => r.saldoTransactionId))
			return {
				success: false,
				status: 400,
				message:
					'Je kan deze banktransactie niet meer veranderen, omdat er bij deze transactie saldo is toegevoegd of afgehaald. Maak een handmatige transactie om dit op te lossen.'
			};

		// TODO: Replace with warning
		// // Check if all amounts match
		// const totalAmount = data.rows.reduce((sum, row) => {
		// 	return sum.add(new Decimal(row.amount));
		// }, new Decimal(0));

		// if (!totalAmount.equals(bankTransaction.amount.abs()))
		// 	return {
		// 		success: false,
		// 		message: `De totale hoeveelheid van de match rows (${totalAmount}) komt niet overeen met de hoeveelheid van de banktransactie (${bankTransaction.amount.abs()}).`,
		// 		status: 400
		// 	};

		// Check if there are conflicting rows
		if (data.rows.some((row) => row.journal && row.saldo))
			return {
				success: false,
				message: 'Je kan geen boekstuk matchen en saldo toevoegen in dezelfde match row.',
				status: 400
			};

		const journalIds = data.rows.map((r) => Number(r.journal)).filter(Boolean);

		// Check if there are duplicate journals
		if (new Set(journalIds).size !== journalIds.length)
			return {
				success: false,
				message: 'Je kan geen boekstukken dubbel matchen.',
				status: 400
			};

		const journals = await db.journal.findMany({
			where: {
				id: {
					in: journalIds
				}
			},
			include: {
				Rows: true,
				TransactionMatchRow: true
			}
		});

		// Check that you cant match a higher amount to a journal than the journal amount
		for (const row of data.rows) {
			if (!row.journal) continue;
			const journal = journals.find((j) => j.id === Number(row.journal));

			// Check if the journal exists
			if (!journal)
				return {
					success: false,
					message: `Boekstuk ${row.journal} in rij ${
						row.description ?? `EUR ${row.amount}`
					} bestaat niet.`,
					status: 400
				};

			// Amount of the journal rows
			// TODO Refactor to util function
			const journalAmount = journal.Rows.reduce((sum, { amount, price }) => {
				return sum.add(new Decimal(amount).mul(new Decimal(price)));
			}, new Decimal(0));

			// Amount already matched from other bank transactions
			const matchedAmount = journal.TransactionMatchRow.reduce((sum, row) => {
				if (row.transactionId === bankTransaction.Transaction.id) return sum;
				return sum.add(new Decimal(row.amount));
			}, new Decimal(0));

			const max = journalAmount.sub(matchedAmount);

			if (max.lessThan(row.amount)) {
				return {
					success: false,
					message: `Het bedrag van de match row${
						` ${row.description}` ?? ''
					} is groter dan het bedrag van het boekstuk ${
						journal.ref
					}. Het maximale bedrag is ${max}.`,
					status: 400
				};
			}
		}

		// Create transactions to change saldo
		const SaldoTransactions = await Promise.all(
			data.rows.map(async (row) => {
				if (!row.saldo) return Promise.resolve(null);

				// TODO figure out why cant create transaction via prisma.
				// TODO use $transaction
				await db.$queryRaw`
          INSERT INTO \`Transaction\` VALUES ();
        `;
				const trans: Transaction[] = await db.$queryRaw`
          SELECT * FROM \`Transaction\` WHERE \`id\`= LAST_INSERT_ID();
        `;

				const relations = [Number(data.relation), FINANCIAL_PERSON_IDS.INVICTUS] as const;
				const isTopup = type === 'TOPUP';
				return db.saldoTransaction.create({
					data: {
						description:
							row.description ??
							`Saldo ${
								isTopup ? 'toegevoegd' : 'verminderd'
							} van banktransactie ${bankTransactionId}`,
						price: row.amount,
						fromId: relations[Number(isTopup)],
						toId: relations[Number(!isTopup)],
						transactionId: trans[0].id
					}
				});
			})
		);

		// TODO prevent saldo transaction if relation is of type other

		// Update relation and reference
		await db.bankTransaction.update({
			where: { id: bankTransactionId },
			data: {
				ref: data.ref,
				relationId: data.relation ? Number(data.relation) : undefined
			}
		});

		// Reset match rows
		await db.transactionMatchRow.deleteMany({
			where: { transactionId: bankTransaction.Transaction.id }
		});

		try {
			await Promise.all(
				data.rows.map((row, i) => {
					const journalId = row.journal ? Number(row.journal) : undefined;
					const saldoTransactionId = SaldoTransactions[i]?.id;

					if (!journalId && !saldoTransactionId)
						return Promise.reject(
							'[ONGEVEER] No journal or transaction id while creating match rows'
						);

					return db.transactionMatchRow.create({
						data: {
							description: row.description,
							amount: row.amount,
							transactionId: bankTransaction.Transaction.id,
							journalId,
							saldoTransactionId
						}
					});
				})
			);
		} catch (e) {
			console.error(e);
			return {
				success: false,
				message:
					'Er is iets fout gegaan bij het matchen van de transactie. Probeer het later opnieuw.',
				status: 500
			};
		}

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
					minValue: 0.01,
					step: 0.01
				},
				{
					name: 'journal',
					label: 'Boekstuk',
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
				}
			]
		},
		{
			name: 'id',
			type: 'hidden'
		} as Field<'hidden'>
	]
});
