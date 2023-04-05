import { RECEIPT_FOLDER } from '$env/static/private'
import * as fs from 'fs'

export function saveReceipt(file: string, filename: string) {
  // save file to disk in RECEIPT_FOLDER with filename as name

  const path = RECEIPT_FOLDER + filename

  fs.writeFileSync(path, file)

}