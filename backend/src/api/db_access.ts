import * as AWS from 'aws-sdk'

import { PnTItem } from '../models/PnT-Item';
import { CreatePnTRequest } from '../requests/CreatePnTRequest';
import { UpdatePnTRequest } from '../requests/UpdatePnTRequest';
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('db_access_Logger')
const docClient = new AWS.DynamoDB.DocumentClient()
const pntTable = process.env.DYNODB_TABLE
const pntIndex = process.env.INDEX_NAME

export async function getPnT(userId: string, pntId: string): Promise<PnTItem> {
  console.log('db_access.getPnT')
  console.log("Query Todo filter by pntId: ", pntId)
  console.log("Key: ", userId + ' ' + pntId)
  const result = await docClient.query({
    TableName: pntTable,
    IndexName: pntIndex,
    KeyConditionExpression: 'userId = :userId and pntId = :pntId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':pntId': pntId
    } 
  }).promise()
  logger.info('getPnT Q Result', result)
  const item = result.Items[0]
  logger.info('Item: ', item)
  const pnt: PnTItem = JSON.parse(JSON.stringify(item)) 
  console.log('Get PnT: ', pnt)
  return pnt
}

export async function getPnTs(userId: string): Promise<string> {
    console.log('db_access.getPnTs')
    console.log("Query PnTs filter by userId: ", userId)

    const result = await docClient.query({
      TableName: pntTable,
      IndexName: pntIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      } 
    }).promise()
    console.log('Get PnTs: ', result.Items)
    
    return JSON.stringify(result.Items)
  }

export async function addPnT(userId: string, data: string): Promise<PnTItem> {
  console.log('db_access.addPnT')
  console.log("Add new Pic-N-Thought for User: ", userId)
  
  const pntData: CreatePnTRequest = JSON.parse(data)
  const newItem: PnTItem = {
    pntId: uuid.v4(),
    userId: userId,
    //createdAt: new Date().toISOString(),
    thought: pntData.thought,
    createdDt: pntData.createdDt,
    mood: pntData.mood
  }  
  logger.info('New Pic-N-Thought', newItem)
  
  await docClient.put({
    TableName: pntTable,
    Item: newItem
  }).promise()
  console.log('Ok')

  return newItem
}

export async function delPnT(userId: string, pntId: string): Promise<void> {
  console.log('db_access.getPnT')
  console.log("Delete Pic-N-Thought: ", pntId)

  console.log("Query Pic-N-Thought")
  const pnt = await getPnT(userId, pntId)  //Get the todo 

  console.log("Key: ", userId + ' ' + pnt.createdDt)
  const result = await docClient.delete({
    TableName: pntTable,
    Key: {
      userId: userId,
      createdDt: pnt.createdDt
    }
  }).promise()
  console.log('Ok ', result)
  return
}

export async function updPnT(userId: string, pntId: string, data: string): Promise<string> {
  console.log('db_access.updPnT')
  console.log("Update Pic-N-Thoughts, pntId: ", pntId)

  console.log("Query Pic-N-Thought")
  const pnt = await getPnT(userId, pntId)  //Get the todo 

  const updData: UpdatePnTRequest = JSON.parse(data)

  console.log("Key: ", userId + ' ' + pnt.createdDt)
  const params = {
    TableName: pntTable,
    Key: {
      userId: userId,
      createdDt: pnt.createdDt,
    },
    UpdateExpression: "set thought = :thought, mood= :mood",
    ExpressionAttributeValues:{
      ":thought": updData.thought,
      ":mood": updData.mood
    },
    ReturnValues:"ALL_NEW"
  };
  const result = await docClient.update(params).promise()   //Update it
  const updatedItem = JSON.stringify(result.Attributes)
  logger.log('Updated', updatedItem)
  console.log('Ok')
  return updatedItem
}

export async function imageUpdPnT(userId: string, pntId: string, imgurl: string): Promise<void> {
  console.log('db_access.imageUpdPnT')
  console.log("Update Pic-N-Thought with S3 image url. PnT ID: ", pntId)

  console.log("Query Pic-N-Thought")
  const pnt = await getPnT(userId, pntId)  

  console.log("Key: ", userId + ' ' + pnt.createdDt)
  console.log("Image URL: ", imgurl)
  const params = {
    TableName: pntTable,
    Key: {
      userId: userId,
      createdDt: pnt.createdDt,
    },
    UpdateExpression: "SET #attach = :imgurl",
    ExpressionAttributeNames:{
        "#attach": "attachmentUrl"
    },
    ExpressionAttributeValues:{
       ":imgurl": imgurl
    },
    ReturnValues:"ALL_NEW"
  };
  const result2 = await docClient.update(params).promise()
  const updatedItem = JSON.stringify(result2.Attributes)
  console.log('Updated:\n', updatedItem)
  return
}