import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deletePicNThought')
import { delPnT } from '../../api/db_access'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('deletePnT fxn')
  logger.info('Event: ', event)

  try {
    const userId = getUserId(event)
    console.log('UserId: ', userId)
  
    const pntId: string = event.pathParameters.pntId
    await delPnT(userId, pntId)
    
    console.log("Success 200")
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "Deleted"
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

