import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { getUserId } from '../utils'
import { getPnTs } from '../../api/db_access'
import { createLogger } from '../../utils/logger'
const logger = createLogger('getPicNThoughts')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('getPnTs fxn')
  logger.info('Event: ', event)
  try {
    const userId = getUserId(event)
    console.log('UserId: ', userId)
  
    const items = JSON.parse(await getPnTs(userId))
    logger.info(items)
  
    console.log("Success 200")
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({items})
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
