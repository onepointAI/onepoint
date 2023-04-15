import { clipboard } from 'electron'
import { getBrowserContnet } from '../os/applescript'
import { Singleton } from '../utils/global'
import { Logger } from '../utils/util'
import { getAiInstance, generatePayload } from '../server'
const h2p = require('html2plaintext')

export default async (req: any, res: any) => {
  try {
    if (!getAiInstance()) {
      res.send({
        code: -1,
        result: 'openkey not set!',
      })
      return
    }
    clipboard.writeText('test resp text')
    try {
      // await activeApp(Singleton.getInstance().getRecentApp())
      const content = await getBrowserContnet()
      const plainText = h2p(content)
      Logger.log('getBrowserContnet:', plainText)

      const completion = await getAiInstance().createChatCompletion(
        generatePayload(`请帮我总结一下这篇内容:${plainText}`, 'Chat')
      )
      Logger.log(completion.data.choices)
      const result = completion.data.choices
      const respContent = result[0].message.content
      clipboard.writeText(respContent)
      Singleton.getInstance().setCopyStateSource(true)
      res.send({
        code: 0,
        result,
      })
    } catch (e) {
      Logger.error('getBrowserContnet:', e)
    }
  } catch (e) {
    res.send({
      code: -1,
      result: e,
    })
  }
}
