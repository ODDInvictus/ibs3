import type { RequestHandler } from './$types';
import Mongo from '$lib/server/mongo';
import { GridFSBucket, type GridFSFile } from 'mongodb';

async function getFile(name: string): Promise<{ buffer: Buffer; data: GridFSFile }> {
	const gfs = new GridFSBucket(Mongo, { bucketName: 'fs' });
	const cursor = gfs.find({ filename: name });
	const doc = await cursor.next();
	if (!doc) return Promise.reject({ code: 'ENOENT' });

	return new Promise((resolve, reject) => {
		const stream = gfs.openDownloadStreamByName(name);
		const chunks: Buffer[] = [];
		stream.start();
		stream.on('data', (chunk) => chunks.push(chunk));
		stream.on('end', async () => {
			resolve({
				buffer: Buffer.concat(chunks),
				data: doc
			});
		});
		stream.on('error', (err) => reject(err));
		stream.end();
	});
}

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { buffer, data } = await getFile(params.filename);
		return new Response(buffer, {
			headers: {
				'Content-Type': data.metadata?.type ?? ''
			}
		});
	} catch (error: any) {
		if (error?.code === 'ENOENT') {
			return new Response(null, { status: 404 });
		}
		console.error(error);
		return new Response(null, { status: 500 });
	}
};
