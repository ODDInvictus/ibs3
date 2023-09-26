import db from './db';

export interface Egg {
	show: boolean;
	id: string;
	img: string | undefined;
	name: string | undefined;
}

export const shouldShowEgg = async (eggId: string, userId: number): Promise<Egg> => {
	const enabled = await db.settings.findUnique({
		where: {
			name: 'EGGHUNT_ENABLED'
		}
	});
	if (enabled?.value != '1')
		return {
			show: false,
			img: undefined,
			name: undefined,
			id: eggId
		};

	const egg = await db.egg.findUnique({
		where: { id: eggId }
	});

	return {
		show: !!(egg && !([...egg.found][Math.round((userId - 1) / 8)] & (1 << (userId - 1) % 8))),
		img: egg?.img,
		name: egg?.name,
		id: eggId
	};
};
