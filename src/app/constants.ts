import { chat, translate, code, post } from './images'

export const Casual = 'Casual'
export const Translate = 'Translate'
export const Summarize = 'Summarize'
export const Prettier = 'Prettier'
export const Analyze = 'Analyze'
export const BuiltInPlugins = [
  {
    logo: chat,
    id: Casual,
    title: Casual,
    loading: false,
  },
  {
    logo: translate,
    id: Translate,
    title: Translate,
    loading: false,
    inputDisable: true,
  },
  {
    logo: code,
    id: Prettier,
    title: Prettier,
    loading: false,
    inputDisable: true,
  },
  {
    logo: post,
    id: Analyze,
    title: Analyze,
    loading: false,
    inputDisable: true,
  },
]

export const Models = ['gpt-3.5-turbo-0301']

export const StoreModelKey = 'KEY_MODEL'
export const StoreApiKey = 'APIKEY_GPT'

export const StoreKey = {
  Set_Model: 'KEY_MODEL',
  Set_ApiKey: 'APIKEY_GPT',
  Set_Lng: 'LNG',
  Set_StoreChat: 'StoreChat',
  Set_SimpleMode: 'SimpleMode',
  Set_Contexual: 'Contexual',
}
