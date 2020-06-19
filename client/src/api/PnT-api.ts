import { apiEndpoint } from '../config'
import { PicNThought } from '../types/PicNThought';
import { CreatePnTRequest } from '../types/CreatePnTRequest';
import { UpdatePnTRequest } from '../types/UpdatePnTRequest';
import Axios from 'axios'

export async function getPicNThought(idToken: string, pntId: string): Promise<PicNThought> {
  console.log('Fetching A PicNThought')

  const response = await Axios.get(`${apiEndpoint}/pnts/${pntId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('get A Pic-N-Thoughts ', response.data)
  return response.data.items
}

export async function getPicNThoughts(idToken: string): Promise<PicNThought[]> {
  console.log('Fetching PicNThoughts')

  const response = await Axios.get(`${apiEndpoint}/pnts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('get Pic-N-Thoughts: ', response.data)
  return response.data.items
}

export async function patchPicNThought(idToken: string, pntId: string, updatedPnT: UpdatePnTRequest): Promise<void> {
  await Axios.patch(`${apiEndpoint}/pnts/${pntId}`, JSON.stringify(updatedPnT), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('patch Pic-N-Thought: ', pntId)
}

export async function deletePicNThought(idToken: string, pntId: string): Promise<void> {
  await Axios.delete(`${apiEndpoint}/pnts/${pntId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('del Pic-N-Thought: ', pntId)
}

export async function getUploadUrl(idToken: string, pntId: string): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/pnts/${pntId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('getSignedUrl: ',response.data.uploadUrl)
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
  console.log('upload Picture: ', uploadUrl)
}

export async function addPicNThought(idToken: string, newPnT: CreatePnTRequest): Promise<PicNThought> {
  const response = await Axios.post(`${apiEndpoint}/pnts`,  JSON.stringify(newPnT), {
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('add Pic-N-Thought: ', newPnT)
  return response.data.item
}
