import { ChatGPTAPI } from 'chatgpt'
// import { FileSystem } from './fileSystem'

export async function chat() {
    // const fileSystem = new FileSystem()
    // const key = await fileSystem.readFileSync('./key', 'utf8')
    // console.log('chat key ==>', key)
    console.log('chat..??????????!!!.')
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY || "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"
  })

  const res = await api.sendMessage('Hello World!')
  console.log('chat result ==>', res.text)
}