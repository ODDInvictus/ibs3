import type { RequestHandler } from './$types';
import spotify, { refreshToken } from '$lib/server/spotify';

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const search = params.get('s');
    if (!search) return new Response(JSON.stringify([]));

    const searchTracks = async () => {
        const { body } = await spotify.searchTracks(search);
        return body.tracks?.items ?? [];
    }

    try {
        const tracks = await searchTracks();
        return new Response(JSON.stringify(tracks));
    } catch (error) {
        
        // Try refreshing the token as it might be expired
        try {
            await refreshToken();
            const tracks = await searchTracks();
            return new Response(JSON.stringify(tracks));
        } catch (error) {
            console.error(error);
            return new Response("Error", { status: 500 });
        }
    }
};