import { ERR_CODES } from '../types'
import { getAiInstance } from '../server'
import { Logger } from '../utils/util'
import { getBrowserContnet } from '../os/applescript'

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

function generatePayload(contents: UserMsg[]) {
  return {
    model: 'gpt-3.5-turbo-0301',
    messages: [
      {
        role: 'system',
        content:
          '请帮总结文章内容，最好条理清晰地用序号标注提炼出核心的观点，我会先发几段文字给你，你不需要马上回复，但在我说“请总结”的时候，你再将之前的内容拼接在一起进行总结，懂了吗',
      },
      ...contents,
    ],
  }
}

export default async (req: any, res: any) => {
  // const { url } = req.body
  // const apiHost = `https://PhantomJScloud.com/api/browser/v2`
  // console.log('url ==>', `https://www.textise.net/showText.aspx?strURL=${encodeURIComponent(url)}`)
  try {
    // const response = await fetch(`${apiHost}/${apiKey}/`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     renderType: 'plainText',
    //     url,
    //   }),
    // })

    const resp = (await getBrowserContnet()) as string
    const text = resp.replace(/[\r\n\t ]/g, '')
    // let chunkLen = 250;
    // let total = text.length;
    // let o = []
    // Logger.log('length ===>', total)
    // for(let i = 0; i < total; i = i+chunkLen) {
    //   o.push(text.slice(i, i+chunkLen))
    // }

    // console.log('o ===>', o)
    // const contents = [] as UserMsg[];
    // [...o, '请总结'].map((content: string) => {
    //   contents.push(getUserContent(content))
    // })

    const contents = [getUserContent('请帮我总结一下下面这篇文章:' + text)]

    const completion = await getAiInstance().createChatCompletion(
      generatePayload(contents)
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
