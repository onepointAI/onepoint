import Store from 'electron-store'
import { ERR_CODES } from '../types'
import { generatePayload, getAiInstance } from '../server'
import { Logger } from '../utils/util'
import { setChat } from '../client/store'
import { StoreKey, BuiltInPlugins } from '../../app/constants'

const store = new Store()

export default async (req: any, res: any) => {
  const { prompt, preset } = req.body
  Logger.log('ask question', prompt)
  res.setHeader('Content-type', 'application/octet-stream')
  if (!getAiInstance()) {
    res.write(String(ERR_CODES.NOT_SET_APIKEY))
    res.end()
    return
  }
  let result = ''
  try {
    const response = await getAiInstance().createChatCompletion(
      generatePayload(prompt, preset),
      { responseType: 'stream' }
    )
    const stream = response.data
    stream.on('data', (chunk: Buffer) => {
      const payloads = chunk.toString().split('\n\n')
      for (const payload of payloads) {
        if (payload.includes('[DONE]')) return
        if (payload.startsWith('data:')) {
          const data = payload.replace(/(\n)?^data:\s*/g, '')
          try {
            const delta = JSON.parse(data.trim())
            const resp = delta.choices[0].delta?.content
            result += resp || ''
            res.write(resp || '')
            Logger.log('chunk resp', resp)
          } catch (error) {
            const errmsg = `Error with JSON.parse and ${payload}.\n${error}`
            Logger.log(errmsg)
            res.write(errmsg)
            res.end()
          }
        }
      }
    })
    stream.on('end', () => {
      Logger.log('Stream done')
      const usePlugin = BuiltInPlugins.filter(
        plugin => plugin.title === preset
      )[0]
      if (store.get(StoreKey.Set_StoreChat) && !usePlugin.nostore) {
        setChat({
          prompt,
          response: result,
          preset,
        })
      }
      res.end()
    })
    stream.on('error', (e: Error) => {
      Logger.error(e)
      res.write(e.message)
      res.end()
    })
  } catch (e) {
    res.write(e)
  }
}
