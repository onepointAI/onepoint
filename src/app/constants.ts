import { chat, translate, code, post } from './images'
import { PluginType } from '../@types'

export const Chat = 'Chat'
export const Translate = 'Translate'
export const Summarize = 'Summarize'
export const Code = 'Code'
export const Analyze = 'Analyze'
export const BuiltInPlugins = [
  {
    logo: chat,
    id: Chat,
    title: Chat,
    loading: false,
    desc: 'Chat mode, feel free to ask any questions you want.',
  },
  {
    logo: code,
    id: Code,
    title: Code,
    loading: false,
    inputDisable: true,
    desc: 'Code Master, generate or refactor the code you want.',
    nostore: true,
    monitorClipboard: true,
  },
  {
    logo: post,
    id: Summarize,
    title: Summarize,
    loading: false,
    inputDisable: true,
    desc: 'Content analysis summary assistant, helps you read and browse web pages more effectively.',
    nostore: true,
    monitorBrowser: true,
  },
  {
    logo: translate,
    id: Translate,
    title: Translate,
    loading: false,
    inputDisable: false,
    monitorClipboard: true,
    desc: 'Language expert, proficient in various languages from different countries.',
    nostore: true,
  },
] as PluginType[]

export const Prompts_ZH_Link =
  'https://github.com/PlexPt/awesome-chatgpt-prompts-zh/blob/main/prompts-zh.json'
export const Models = ['gpt-3.5-turbo-0301']
export const StoreKey = {
  Set_Model: 'KEY_MODEL',
  Set_BasePath: 'BASE_PATH',
  Set_ApiKey: 'APIKEY_GPT',
  Set_Lng: 'LNG',
  Set_StoreChat: 'STORE_CHAT',
  Set_SimpleMode: 'SIMPLE_MODE',
  Set_Contexual: 'CONTEXUAL',
  History_Chat: 'CHAT_HISTORY',
  List_Prompt: 'PROMPT_LIST',
  Map_Pluginprompt: 'PLUGIN_PROMPT_MAP',
}
