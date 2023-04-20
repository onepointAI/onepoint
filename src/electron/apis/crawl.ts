import { ERR_CODES } from '../types'
import { getAiInstance } from '../server'
import { Logger } from '../utils/util'
import { getPluginPrompt } from '../client/store'
import { getBrowserContnet } from '../os/applescript'
import { PresetType } from '../../@types'

interface UserMsg {
  role: string
  content: string
}

function getUserContent(content: string): UserMsg {
  return {
    role: 'user',
    content,
  }
}

function generatePayload(contents: UserMsg[], preset: PresetType) {
  return {
    model: 'gpt-3.5-turbo-0301',
    messages: [
      {
        role: 'system',
        content: getPluginPrompt(preset).prompt,
      },
      ...contents,
    ],
  }
}

export default async (req: any, res: any) => {
  const { preset } = req.body
  try {
    const resp = (await getBrowserContnet()) as string
    const text = resp.replace(/[\r\n\t ]/g, '')
    if (text.length > 4000) {
      res.send({
        code: ERR_CODES.TOKEN_TOO_LONG,
        result: null,
      })
      return
    }

    // let chunkLen = 250;
    // let total = text.length;
    // let o = []
    // Logger.log('length ===>', total)
    // for(let i = 0; i < total; i = i+chunkLen) {
    //   o.push(text.slice(i, i+chunkLen))
    // }
    // console.log('o ===>', o)
    // const contents = [] as UserMsg[];
    // [...o, 'summarize this website:'].map((content: string) => {
    //   contents.push(getUserContent(content))
    // })

    const contents = [getUserContent(text)]
    const completion = await getAiInstance().createChatCompletion(
      generatePayload(contents, preset)
    )

    console.log(completion.data.choices)
    const result = completion.data.choices
    const respContent = result[0].message.content

    res.send({
      code: 0,
      result: respContent,
    })
  } catch (e) {
    Logger.error(e)
    res.send({
      code: ERR_CODES.NETWORK_CONGESTION,
      result: e,
    })
  }
}
