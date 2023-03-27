import Minio from 'minio'
import { MINIO_ENDPOINT, MINIO_KEY, MINIO_SECRET } from '$env/static/private'

const CDNClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  useSSL: true,
  accessKey: MINIO_KEY,
  secretKey: MINIO_SECRET
})

export default CDNClient