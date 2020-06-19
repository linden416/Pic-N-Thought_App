import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { getUserId } from '../utils'
import { getPnT } from '../../api/db_access'
import { createLogger } from '../../utils/logger'
const logger = createLogger('get A PicNThought')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('getPnT fxn')
  logger.info('Event: ', event)
  try {
    const userId = getUserId(event)
    console.log('UserId: ', userId)
  
    const pntId: string = event.pathParameters.pntId
    const pnt = await getPnT(userId, pntId)
    logger.info(pnt)
  
    console.log("Success 200")
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({pnt})
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
