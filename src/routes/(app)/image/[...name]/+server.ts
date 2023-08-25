import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private'
import fs from 'fs/promises'
import redis from '$lib/server/cache';
import sharp from 'sharp'
import { loadPhotoById, type PhotoSize } from '$lib/server/images';

const UPLOAD_FOLDER = env.UPLOAD_FOLDER;
const STATIC_FOLDER = env.STATIC_FOLDER;
const IMAGE_CACHE_TIME = env.IMAGE_CACHE_TIME ?? 1;

const SIZES = ['small', 'medium', 'large', 'original']

export const GET: RequestHandler = async ({ request, params, setHeaders, url }) => {
  // First get the filename from the request

  let filename = params.name;

  // Does the query contain a size?
  let size = url.searchParams.get('size')

  // If the size param is set, but it is not in the form of 100x100, or 'small' etc., return 404
  // if (size && (!size.includes('x') && !SIZES.includes(size.split('x')[1]))) {
  if (size && (!SIZES.includes(size) && !size.includes('x'))) {
    return new Response('Illegal size parameter: ' + size, { status: 404 });
  }

  if (!size) size = 'large'

  if (filename.startsWith('id/')) {
    const id = parseInt(filename.split('/')[1])

    let sizeToLoad = size

    if (size.includes('x')) sizeToLoad = getBestImageSizeToLoad(size)

    const photo = await loadPhotoById(id, sizeToLoad as PhotoSize)

    if (!photo) {
      return new Response('File not found', { status: 404 });
    }

    if (size.includes('x')) {
      photo.buffer = await resizeImage(photo.buffer, size)
    }

    setHeaders({
      'Content-Type': photo.contentType,
      'Cache-Control': `public, max-age=${IMAGE_CACHE_TIME}`
    })

    return new Response(photo.buffer)
  }

  let isStatic = url.searchParams.get('static') === 'true'

  // Then get the file from the server
  try {
    const agent = request.headers.get('user-agent')

    const path = isStatic ? STATIC_FOLDER : UPLOAD_FOLDER

    // Edge ondersteund geen AVIF om een of andere kut reden, dus zij krijgen JPEG
    if (agent && (agent.includes('Edg/') || agent.includes('Edge'))) {
      // Set headers to jpeg and cache for a whatever time is in the env.
      setHeaders({
        'Content-Type': 'image/jpeg',
        'Cache-Control': `public, max-age=${IMAGE_CACHE_TIME}`
      })
      // First, check the cache
      const cachedFile = await getImageFromCache(filename, 'jpeg-' + size)

      if (cachedFile) {
        return new Response(cachedFile)
      }

      // If the file is not in the cache, read it from disk
      const photo = await readJpeg(path, filename, size)

      // Cache the file
      await cacheImage(filename, 'jpeg-' + size, photo)

      return new Response(photo)
    }

    // First check if we have the file in the cache
    const cachedFile = await redis.get(`file:${filename}:${size}`)

    if (cachedFile) {
      const buf = Buffer.from(cachedFile, 'binary')
      setHeaders({
        'Content-Type': 'image/jpeg',
        'Cache-Control': `public, max-age=${IMAGE_CACHE_TIME}`
      })
      return new Response(buf);
    }

    // We do not have the file in the cache, so we need to read it from disk

    let buf: Buffer | null = null

    if (SIZES.includes(size)) {
      // These images have been premade, so we can just read them from disk

      if (size === 'original') {
        // If size is set to original, the /id/ route should be used instead
        return new Response('Can not use size=original with this endpoint, use /image/id/{photo_id} or size=large instead', { status: 405 });
      }

      buf = await readImage(path, `${filename}-${size}.avif`)

    } else if (size.includes('x')) {
      // These are done dynamically, so we need to read whatever size is closest and resize it
      const sizeToLoad = getBestImageSizeToLoad(size)

      const photo = await readImage(path, `${filename}-${sizeToLoad}.avif`)

      buf = await resizeImage(photo, size)
    }

    // 404, since if size is not set, it defaults to large, thus buf will not be null then
    if (!buf) {
      console.log('404')
      return new Response('File not found', { status: 404 });
    }


    redis.set(`file:${filename}:${size}`, buf.toString('binary'), 'EX', IMAGE_CACHE_TIME)

    setHeaders({
      'Content-Type': 'image/avif',
      'Cache-Control': `public, max-age=${IMAGE_CACHE_TIME}`
    })
    return new Response(buf);
  } catch (err) {
    console.log('[IMAGE] Not found: ' + filename)
    return new Response('File not found', { status: 404 });
  }
};

async function readImage(path: string, name: string): Promise<Buffer> {
  return await fs.readFile(`${path}/${name}`)
}

async function readJpeg(path: string, name: string, size: string | undefined): Promise<Buffer> {
  const file = await fs.readFile(`${path}/${name}`)

  if (size) {
    const [width, height] = size.split('x')

    return await sharp(file)
      .resize(parseInt(width), parseInt(height))
      .jpeg({ mozjpeg: true, quality: 75 })
      .toBuffer()
  }

  return await sharp(file)
    .jpeg({ mozjpeg: true, quality: 75 })
    .toBuffer()
}

async function cacheImage(filename: string, size: string, buf: Buffer) {
  redis.set(`file:${filename}:${size}`, buf.toString('binary'), 'EX', IMAGE_CACHE_TIME)
}

async function getImageFromCache(filename: string, size: string): Promise<Buffer | null> {
  const cachedFile = await redis.get(`file:${filename}:${size}`)

  if (!cachedFile) return null

  return Buffer.from(cachedFile, 'binary')
}

function getBestImageSizeToLoad(size: string): string {
  const [width, height] = size.split('x')

  let largestSide = Number(width)

  if (height > width) {
    largestSide = Number(height)
  }

  let sizeToLoad = 'large'

  if (largestSide < 800) {
    sizeToLoad = 'small'
  } else if (largestSide < 1600) {
    sizeToLoad = 'medium'
  } else {
    sizeToLoad = 'large'
  }

  return sizeToLoad
}

function resizeImage(buf: Buffer, size: string): Promise<Buffer> {
  const [width, height] = size.split('x')

  return sharp(buf)
    .resize(parseInt(width), parseInt(height))
    .avif({ quality: 70 })
    .toBuffer()
}