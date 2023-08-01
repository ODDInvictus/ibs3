import type { PageServerLoad } from './$types';
import db from "$lib/server/db";

export const load = (async ({ locals }) => {
    return {
        liked: (await db.reaction.findMany({
            where: {
                userId: locals.user.id,
                liked: true,
            },
            select: {
                trackId: true,
            },
        })).map((reaction) => reaction.trackId),
    };
}) satisfies PageServerLoad;