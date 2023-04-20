import compression from 'compression'
import Store from 'electron-store'
import express from 'express'
import accountApi from './apis/account'
import promptApi from './apis/prompt'
import applyApi from './apis/apply'
import testApi from './apis/test'
import crawlApi from './apis/crawl'
import { PresetType } from '../@types'
import { StoreKey } from '../app/constants'
import { Logger } from './utils/util'
import { getChatList, getPluginPrompt } from './client/store'

const { Configuration, OpenAIApi } = require('openai')
const store = new Store()
let openai = null as any

function getContextual(prompt: PresetType) {
  const num = (store.get(StoreKey.Set_Contexual) as number) || 0
  const sPreset = [
    {
      role: 'system',
      content: getPluginPrompt(prompt).prompt,
    },
  ]

  if (prompt && num) {
    const list = getChatList(prompt).slice(-num)
    const contexual = list.map(item => {
      return [
        {
          role: 'user',
          content: item.prompt,
        },
        {
          role: 'assistant',
          content: item.response,
        },
      ]
    })
    return [...contexual.flat(), ...sPreset]
  }
  return [...sPreset]
}

export function generatePayload(content: string, prompt: PresetType) {
  return {
    model: 'gpt-3.5-turbo-0301',
    messages: [
      ...getContextual(prompt),
      {
        role: 'user',
        content,
      },
    ],
    temperature: 0,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
    stream: true,
  }
}

export function getAiInstance() {
  if (openai) {
    return openai
  }

  const basePath = store.get(StoreKey.Set_BasePath) as string
  const apiKey = store.get(StoreKey.Set_ApiKey) as string
  Logger.log('store apikey', apiKey)

  if (apiKey) {
    openai = new OpenAIApi(
      new Configuration({
        apiKey,
        basePath: basePath || 'https://closeai.deno.dev/v1',
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
app.post('/prompt', promptApi)
app.post('/apply', applyApi)
app.post('/test', testApi)
app.post('/account', accountApi)
app.post('/crawl', crawlApi)
app.listen(port, async () => {
  Logger.log(`onepoint listening on port ${port}!`)
})
