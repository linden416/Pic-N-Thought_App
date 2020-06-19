import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
const logger = createLogger('addpntimageurl')

import { imageUpdPnT } from '../../api/db_access'
import { getSignedUrl } from '../../api/s3_access'
import { getUserId } from '../utils'
import * as uuid from 'uuid'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('addPnTImageUrl fxn')
  logger.info('Event: ', event)
  try {
    const userId = getUserId(event)
    console.log('UserId: ', userId)
  
    const pntId: string = event.pathParameters.pntId

    //Get a signedURL from S3 for a new image
    const imageId: string = uuid.v4()
    const signedURL = await getSignedUrl(imageId)
    console.log("Signed URL:\n", signedURL)
  
    const imgurl = `https://${process.env.IMAGES_S3_BUCKET}.s3.amazonaws.com/${imageId}`
    await imageUpdPnT(userId, pntId, imgurl)
  
    console.log("Success 200")
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({uploadUrl: signedURL})
    }
  } catch(e) {
    logger.error('Exception:', e.message)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: e.message
    }
  }
}
