import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
const logger = createLogger('s3_access')

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

// Create a signedURL in S3 bucket to put new object
export async function getSignedUrl(imageId: string): Promise<string> {
  logger.info('Get S3 SignedURL for imageId', imageId)
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: parseInt(urlExpiration)
  })
}

