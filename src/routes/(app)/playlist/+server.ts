import db from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({request, locals}) => {
    const userId = locals.user.id;
    const { trackId, liked }: { trackId: string, liked: boolean } = await request.json();

    try {
        await db.track.upsert({
            where: {
                id: trackId,
            },
            update: {},
            create: {
                id: trackId,
            },
        });

        await db.reaction.upsert({
            where: {
                userId_trackId: {
                    userId,
                    trackId,
                },
            },
            update: {
                liked,
            },
            create: {
                userId,
                trackId,
                liked,
            }
        });

        return new Response();
    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }
};