import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const userId = locals.user.id;
	return {
		toReact: db.track.findMany({
			where: {
				inPlaylist: false,
				likes: {
					none: {
						userId
					}
				}
			},
			orderBy: [
				{
					likes: {
						_count: 'desc'
					}
				},
				{
					createdAt: 'desc'
				}
			],
			select: {
				id: true,
				likes: {
					select: {
						user: {
							select: {
								firstName: true,
								nickname: true
							}
						}
					}
				}
			}
		})
	};
}) satisfies PageServerLoad;
