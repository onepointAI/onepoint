import { chat, translate, code, post } from './images'
import { PluginType } from '../@types'

export const Casual = 'Casual'
export const Translator = 'Translator'
export const Summarizer = 'Summarize'
export const Programmer = 'Programmer'
export const Analyst = 'Analyst'
export const BuiltInPlugins = [
  {
    logo: chat,
    id: Casual,
    title: Casual,
    loading: false,
    desc: 'Chat mode, feel free to ask any questions you want.',
  },
  {
    logo: code,
    id: Programmer,
    title: Programmer,
    loading: false,
    inputDisable: true,
    desc: 'Code Master, generate or refactor the code you want.',
    nostore: true,
    monitorClipboard: true,
  },
  {
    logo: post,
    id: Summarizer,
    title: Summarizer,
    loading: false,
    inputDisable: true,
    desc: 'Content analysis summary assistant, helps you read and browse web pages more effectively.',
    nostore: true,
    monitorBrowser: true,
  },
  {
    logo: translate,
    id: Translator,
    title: Translator,
    loading: false,
    inputDisable: false,
    monitorClipboard: true,
    desc: 'Language expert, proficient in various languages from different countries.',
    nostore: true,
  },
] as PluginType[]

export const Prompts_Link =
  'https://github.com/onepointAI/awesome-chatgpt-prompts/blob/main/prompts.csv'
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
