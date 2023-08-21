import { prisma } from './prisma';
import sharp from 'sharp';
import fs from 'fs'

const PROCESSED_PHOTO_PATH = process.env.PROCESSED_PHOTO_PATH || './static/fotos'
const UPLOAD_DIR = process.env.UPLOAD_DIR || './static/upload/fotos'

const quality = 70

let processing: number[] = []

export async function processPhotos() {
  const startMs = Date.now()

  // First we fetch all photos that have not been processed yet
  let photos = await prisma.photo.findMany({
    where: {
      processed: false
    }
  })

  photos = photos.filter(p => {
    if (processing.includes(p.id)) return false
    processing.push(p.id)
    return true
  })

  log(`Found ${photos.length} photo(s) to process with id(s) ${photos.map(p => p.id).join(', ')}`)

  for (const photo of photos) {
    const originalPath = `${UPLOAD_DIR}/${photo.filename}.${photo.extension}`
    const outPath = (quality: string, ext?: string) => `${PROCESSED_PHOTO_PATH}/${photo.filename}-${quality}.${ext || 'avif'}`

    const buf = await fs.readFileSync(originalPath)

    log('Processing photo', photo.id)

    // Current height and width
    let { width, height } = await sharp(buf).metadata()

    // If height or width are not defined, set them to 1920x1080
    if (!width) width = 1920
    if (!height) height = 1080

    try {
      let rw: number | null = width
      let rh: number | null = height

      if (width > height) {
        rw = 1920
        rh = null
      } else {
        rw = null
        rh = 1920
      }

      await sharp(buf)
        .resize(rw, rh)
        .avif({ quality })
        .toFile(outPath('large'))

      if (width > height) {
        rw = 1280
        rh = null
      } else {
        rw = null
        rh = 1280
      }

      await sharp(buf)
        .resize(rw, rh)
        .avif({ quality })
        .toFile(outPath('medium'))

      if (width > height) {
        rw = 640
        rh = null
      } else {
        rw = null
        rh = 640
      }

      await sharp(buf)
        .resize(rw, rh)
        .avif({ quality })
        .toFile(outPath('small'))

      await prisma.photo.update({
        where: {
          id: photo.id
        },
        data: {
          processed: true
        }
      })

      processing = processing.splice(processing.indexOf(photo.id), 1)
    } catch (err) {
      processing = processing.splice(processing.indexOf(photo.id), 1)
      error(`Error processing photo ${photo.id}`)
      error(err)
    }
  }

  const stopMs = Date.now()
  log('Done processing photos in ' + ((stopMs - startMs) / 1000) + 's')
}

function log(...args: any[]) {
  console.log('[PHOTO PROCESSING]', ...args)
}

function error(...args: any[]) {
  console.error('[ERR][PHOTO PROCESSING]', ...args)
}