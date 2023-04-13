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
  },
  {
    logo: post,
    id: Analyze,
    title: Analyze,
    loading: false,
    inputDisable: true,
    desc: 'Professional writer, proficient in writing various types of copy.',
  },
  {
    logo: translate,
    id: Translate,
    title: Translate,
    loading: false,
    inputDisable: true,
    desc: 'Language expert, proficient in various languages from different countries.',
  },
] as PluginType[]

export const Models = ['gpt-3.5-turbo-0301']
export const StoreKey = {
  Set_Model: 'KEY_MODEL',
  Set_ApiKey: 'APIKEY_GPT',
  Set_Lng: 'LNG',
  Set_StoreChat: 'StoreChat',
  Set_SimpleMode: 'SimpleMode',
  Set_Contexual: 'Contexual',
  History_Chat: 'CHAT_HISTORY',
}
