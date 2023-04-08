import { clipboard } from 'electron'
import compression from 'compression'
import Store from 'electron-store'
import express from 'express'
import { activeApp, applySelection, getBrowserContnet } from './os'
import { Singleton } from './global'
import { Logger } from './util'

const h2p = require('html2plaintext')
const { Configuration, OpenAIApi } = require('openai')
const store = new Store()

function generatePayload(content: string) {
  // const apiKey = store.get('api_key');
  // const payload = generatePayload(
  //   `I want you to act as an ${targetLang} translator. I will speak to you in any language and you translate it and answer in the corrected and improved version of my sentence/phrase/word in ${targetLang}. I want you to only reply the translated sentence/phrase/word and nothing else, do not write explanations. You do not need to reply a complete sentence.`,
  //   `The text or word is: ${text}`
  // )
  return {
    // model: "text-davinci-003",
    // prompt: "你好",
    model: 'gpt-3.5-turbo-0301',
    messages: [
      // { role: 'system', content: `I want you to act as an ${targetLang} translator. I will speak to you in any language and you translate it and answer in the corrected and improved version of my sentence/phrase/word in ${targetLang}. I want you to only reply the translated sentence/phrase/word and nothing else, do not write explanations. You do not need to reply a complete sentence.`, },
      {
        role: 'user',
        content,
        // content: '你好，请问你是chatgpt吗'
      },
    ],
    // 采样温度。值越高意味着模型承担的风险越大。
    // 对于需要创意的场景，可以尝试0.9，
    // 对于答案明确的场景，建议用0（argmax采样）
    // 建议不要与top_p同时改变。
    // 详见《ChatGPT模型采样算法详解》
    temperature: 0,
    // 核采样（温度采样的另一种方式），其中模型考虑具有top_p概率质量的token的结果。因此，0.1意味着只考虑包含最高10%概率质量的token
    // 建议不要与temperature同时改变。
    // 详见《ChatGPT模型采样算法详解》
    top_p: 1,
    // 数值介于-2.0和2.0之间。正值根据文本中新token已经出现的频率惩罚新token，从而降低模型逐字重复同一行的可能性。
    // 详见 《ChatGPT模型中的惩罚机制》
    frequency_penalty: 1,
    // 数值介于-2.0和2.0之间。正值将根据到目前为止新token是否出现在文本中来惩罚新token，从而增加模型谈论新主题的可能性。
    // 详见 《ChatGPT模型中的惩罚机制》
    presence_penalty: 1,
    stream: true,
  }
}

let openai = null as any
function getAiInstance() {
  if (openai) {
    return openai
  }

  const apiKey = store.get('ChatGPT_apikey') as string
  Logger.log('store apikey', apiKey)

  if (apiKey) {
    openai = new OpenAIApi(
      new Configuration({
        apiKey,
        // basePath: 'https://openai.geekr.cool/v1'
        basePath: 'https://closeai.deno.dev/v1',
      })
    )
    return openai
  }
  return null
}

const app = express()
const port = 4000
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/ask', async (req: any, res: any) => {
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
})

app.post('/apply', async (req: any, res: any) => {
  await activeApp(Singleton.getInstance().getRecentApp())
  const result = await applySelection()
  res.send({
    code: 0,
    result,
  })
})

app.post('/test', async (req: any, res: any) => {
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
        generatePayload(`请帮我总结一下这篇内容:${plainText}`)
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
})

app.listen(port, async () => {
  Logger.log(`onepoint listening on port ${port}!`)
})
