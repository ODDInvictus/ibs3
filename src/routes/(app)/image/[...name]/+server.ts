import type { RequestHandler } from '../$types';
import { env } from '$env/dynamic/private'
import fs from 'fs'
import redis from '$lib/server/cache';
import sharp from 'sharp'

const UPLOAD_FOLDER = env.UPLOAD_FOLDER;
const IMAGE_CACHE_TIME = env.IMAGE_CACHE_TIME ?? 1;

export const GET: RequestHandler = async ({ request, params, setHeaders, url }) => {
  // First get the filename from the request

  // @ts-ignore Niet zo piepen
  let filename = params.name;

  // Does the query contain a size?
  let size = url.searchParams.get('size')

  if (size && !size.includes('x')) {
    return new Response('File not found', { status: 404 });
  }

  if (!size) size = 'regular'

  // Then get the file from the server
  try {
    const agent = request.headers.get('user-agent')

    // Edge ondersteund geen AVIF om een of andere kut reden, dus zij krijgen geen cache lmaoo
    if (agent && (agent.includes('Edg/') || agent.includes('Edge'))) {
      setHeaders({
        'Content-Type': 'image/jpeg',
        'Cache-Control': `public, max-age=${IMAGE_CACHE_TIME}`
      })
      return new Response(await readJpeg(filename, size))
    }

    const file = fs.readFileSync(`${UPLOAD_FOLDER}/${filename}`)

    // First check if we have the file in the cache
    const cachedFile = await redis.get(`file::${filename}::${size}`)

    if (cachedFile) {
      const buf = Buffer.from(cachedFile, 'binary')
      setHeaders({
        'Content-Type': 'image/jpeg',
        'Cache-Control': `public, max-age=${IMAGE_CACHE_TIME}`
      })
      return new Response(buf);
    }

    let buf: Buffer

    if (size !== 'regular') {
      const [width, height] = size.split('x')

      buf = await sharp(file)
        .resize(parseInt(width), parseInt(height))
        .avif({ quality: 90 })
        .toBuffer()
    } else {
      buf = await sharp(file)
        .avif({ quality: 90 })
        .toBuffer()
    }

    redis.set(`file::${filename}::${size}`, buf.toString('binary'), 'EX', IMAGE_CACHE_TIME)

    setHeaders({
      'Content-Type': 'image/jpeg',
      'Cache-Control': `public, max-age=${IMAGE_CACHE_TIME}`
    })
    return new Response(buf);
  } catch (err) {
    return new Response('File not found', { status: 404 });
  }
};

async function readJpeg(name: string, size: string | undefined): Promise<Buffer> {
  const file = fs.readFileSync(`${UPLOAD_FOLDER}/${name}`)

  if (size) {
    const [width, height] = size.split('x')

    return await sharp(file)
      .resize(parseInt(width), parseInt(height))
      .jpeg({ mozjpeg: true })
      .toBuffer()
  }

  return await sharp(file)
    .jpeg({ mozjpeg: true })
    .toBuffer()
}