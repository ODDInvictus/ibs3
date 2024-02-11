import { tallySheetIsProcessed } from '$lib/ongeveer/db';
import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	let p = Number(url.searchParams.get('p'));
	if (p < 0) p = 0;

	let size = Number(url.searchParams.get('size'));
	if (size <= 0) size = 10;

	const sheets = await db.streeplijst.findMany({
		orderBy: { createdAt: 'desc' },
		take: size,
		skip: p * size
	});

	const sheetsWithStatus = [];
	for (const sheet of sheets) {
		const isProcessed = await tallySheetIsProcessed(sheet.id);
		sheetsWithStatus.push({ isProcessed, sheet });
	}

	return { sheets: sheetsWithStatus, size, p };
}) satisfies PageServerLoad;
