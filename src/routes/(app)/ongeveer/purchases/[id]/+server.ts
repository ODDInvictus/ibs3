import { createTransaction, getInvictusId, getJournalStatus } from '$lib/ongeveer/db';
import { authorization } from '$lib/ongeveer/utils';
import db from '$lib/server/db';
import Decimal from 'decimal.js';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals, url }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) return new Response('ID is geen nummer', { status: 400 });

	if (!authorization(locals.roles))
		return new Response('Je moet senaat of financie zijn', { status: 403 });

	try {
		var status: Awaited<ReturnType<typeof getJournalStatus>> = await getJournalStatus(id);
	} catch (error) {
		console.error(error);
		return new Response('Kan de status van de aankoop niet verkrijgen', { status: 500 });
	}

	if (!status) return new Response(null, { status: 404 });
	if (status === 'PAID')
		return new Response(
			'Aankoop is gematched aan een banktransactie, unmatch de banktransactie voor je de aankoop kan verwijderen',
			{ status: 409 }
		);

	const type = url.searchParams.get('type');
	try {
		if (type === 'declaration') {
			await db.declarationData.update({
				where: {
					journalId: id
				},
				data: {
					status: 'DECLINED'
				}
			});
		}

		await db.journal.delete({ where: { id } });
	} catch (error) {
		console.error(error);
		return new Response('Kan de aankoop niet verwijderen', { status: 500 });
	}

	// TODO delete attachments

	return new Response(null, { status: 200 });
};

/**
 * Keur een declaratie goed
 */
export const PATCH: RequestHandler = async ({ params, locals }) => {
	const id = Number(params.id);
	if (Number.isNaN(id)) return new Response('ID is geen nummer', { status: 400 });

	if (!authorization(locals.roles))
		return new Response('Je moet senaat of financie zijn', { status: 403 });

	// Find the journal and check if it's a declaration and pending
	const journal = await db.journal.findUnique({
		where: { id, type: 'DECLARATION', DeclarationData: { status: 'PENDING' } },
		include: { Rows: true, TransactionMatchRow: true }
	});

	if (!journal) return new Response('Declaratie niet gevonden', { status: 404 });

	const total = journal.Rows.reduce(
		(acc, { amount, price }) => acc.add(new Decimal(amount).mul(price)),
		new Decimal(0)
	);
	const matched = journal.TransactionMatchRow.reduce(
		(acc, { amount }) => acc.add(amount),
		new Decimal(0)
	);
	const toPay = total.sub(matched);

	try {
		const transaction = await createTransaction({
			giver: await getInvictusId(),
			receiver: journal.relationId,
			amount: toPay,
			description: `Declaratie: ${journal.description}`
		});

		// Match transaction to journal
		await db.transactionMatchRow.create({
			data: {
				transactionId: transaction.Transaction.id,
				journalId: journal.id,
				amount: toPay,
				description: `Declaratie: ${journal.description}`
			}
		});

		// Update status of declaration
		await db.declarationData.update({
			where: {
				journalId: journal.id
			},
			data: {
				status: 'ACCEPTED'
			}
		});
	} catch (error) {
		console.error(error);
		return new Response('Kan de declaratie niet goedkeuren', { status: 500 });
	}

	return new Response(null, { status: 200 });
};
