import { generatePayload, getAiInstance } from '../server'
import { Logger } from '../utils/util'

export default async (req: any, res: any) => {
  Logger.log('ask question', req.body.question)
  res.setHeader('Content-type', 'application/octet-stream')
  if (!getAiInstance()) {
    res.write('please save your openkey first')
    return
  }
  try {
    const response = await getAiInstance().createChatCompletion(
      generatePayload(req.body.question),
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
