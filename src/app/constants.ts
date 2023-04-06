import { logo, chat, translate, code, post } from './images'

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
