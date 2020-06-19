import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { CreatePnTRequest } from '../../requests/CreatePnTRequest';
import { createLogger } from '../../utils/logger'
const logger = createLogger('createPicNThought')
import { addPnT } from '../../api/db_access'
import { PnTItem } from '../../models/PnT-Item';
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('createPnT fxn')
  logger.info('Event: ', event)
  try {
    const userId = getUserId(event)
    console.log('UserId: ', userId)
  
    //Validate input
    const pntData: CreatePnTRequest = JSON.parse(event.body)
    if (pntData.thought == null || pntData.thought == undefined || pntData.thought.length == 0) { 
      throw new Error("Missing required data Thought")
    }
    else if (pntData.createdDt == null || pntData.createdDt == undefined || pntData.createdDt.length == 0) { 
      throw new Error("Missing required data Create Date")
    }
    else if (pntData.mood == null || pntData.mood == undefined || pntData.mood.length == 0) { 
      throw new Error("Missing required data Mood")
    }

    //Add new Pic-N-Thought
    const item: PnTItem = await addPnT(userId, event.body)
  
    console.log("Success 201")
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ item })
    }
  } catch(e) {
    logger.error('Exception:', e.message)
    var codeStatus = 500 //Unexpected server error default
    if (e.message.includes('Missing required data'))
        codeStatus = 400 //Bad Request
    return {
      statusCode: codeStatus,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: e.message
    }
  }
  
}

