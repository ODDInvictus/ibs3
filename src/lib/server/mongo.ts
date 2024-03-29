import { GridFSBucket, MongoClient, ServerApiVersion } from 'mongodb';
import { env } from '$env/dynamic/private';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(env.MONGO_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});

export const mongo = client.db(env.MONGO_DB_NAME);

// TODO covert to jpeg and compress (ffmpeg?)
export async function uploadFile(
	file: File,
	opts: { toJpeg?: boolean; compression?: number } = {}
) {
	const bucket = new GridFSBucket(mongo);
	const buffer = Buffer.from(await file.arrayBuffer());
	// check if name already exists and generate a new one like 'name-2.jpeg'
	let name = file.name;
	let i = 1;
	while (await bucket.find({ filename: name }).hasNext()) {
		name = `${file.name.replace(/\.\w+$/, '')}-${i++}.${file.name.split('.').pop()}`;
	}
	bucket
		.openUploadStream(name, {
			metadata: { type: file.type }
		})
		.end(buffer);
	return name;
}
