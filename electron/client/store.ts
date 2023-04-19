import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Store from 'electron-store'
import { ChatContent, PromptSet } from '../types'
import {
  setStore,
  getStore,
  removeChat,
  addPrompt,
  editPrompt,
  removePrompt,
  getChatList as getChatListEvt,
  getPromptList as getPromptListEvt,
  getPluginPrompt as getPluginPromptEvt,
  setPluginPrompt as setPluginPromptEvt,
} from '../constants/event'
import { PresetType } from '../../src/@types'
import {
  Chat,
  Translate,
  Summarize,
  Code,
  Analyze,
  StoreKey,
} from '../../src/app/constants'
import * as prompts from '../prompt/prompts-zh.json'

const store = new Store()

// TODO: need to refactor to schema
export function init() {
  const promptTemplates = store.get(StoreKey.List_Prompt) as string | undefined
  const pluginPrompts = store.get(StoreKey.Map_Pluginprompt) as
    | string
    | undefined
  if (typeof promptTemplates === 'undefined') {
    const _prompts = prompts.map(item => {
      return {
        character: item.act,
        prompt: item.prompt,
      }
    })
    store.set(StoreKey.List_Prompt, JSON.stringify(_prompts))
  }
  if (typeof pluginPrompts === 'undefined') {
    setPluginPrompt({ plugin: Chat, character: 'AI写作导师' })
    setPluginPrompt({ plugin: Code, character: '编程大师' })
    setPluginPrompt({ plugin: Analyze, character: '网页总结' })
    setPluginPrompt({ plugin: Summarize, character: '网页总结' })
    setPluginPrompt({ plugin: Translate, character: '英语翻译和改进者' })
  }
}

export function setupStoreHandlers() {
  ipcMain.handle(
    setStore,
    async (
      event: IpcMainInvokeEvent,
      { key, blob }: { key: string; blob: any }
    ) => {
      store.set(key, blob)
    }
  )

  ipcMain.handle(getStore, async (event: IpcMainInvokeEvent, key: string) => {
    return store.get(key)
  })

  ipcMain.handle(
    getChatListEvt,
    async (event: IpcMainInvokeEvent, preset: PresetType) => {
      return getChatList(preset)
    }
  )

  ipcMain.handle(
    removeChat,
    async (
      event: IpcMainInvokeEvent,
      { preset, index }: { preset: PresetType; index: number }
    ) => {
      const list = getChatList(preset)
      list.splice(index, 1)
      const mapStr = store.get(StoreKey.History_Chat) as string | undefined

      if (typeof mapStr !== 'undefined') {
        const chatMap = JSON.parse(mapStr)
        chatMap[preset] = list
        store.set(StoreKey.History_Chat, JSON.stringify(chatMap))
        return list
      } else {
        return []
      }
    }
  )

  ipcMain.handle(
    addPrompt,
    async (
      event: IpcMainInvokeEvent,
      { character, prompt }: { character: string; prompt: string }
    ) => {
      const list = getPromptList()
      const index = list.findIndex(item => item.character === character)
      if (index !== -1) {
        return false
      }
      list.push({
        character,
        prompt,
      })
      store.set(StoreKey.List_Prompt, JSON.stringify(list))
      return list
    }
  )

  ipcMain.handle(
    editPrompt,
    async (
      event: IpcMainInvokeEvent,
      {
        former,
        character,
        prompt,
      }: { former: string; character: string; prompt: string }
    ) => {
      const list = getPromptList()
      const index = list.findIndex(item => item.character === former)
      if (index !== -1) {
        list.splice(index, 1)
        list.splice(index, 1, {
          character,
          prompt,
        })
        store.set(StoreKey.List_Prompt, JSON.stringify(list))
        return list
      }
      return false
    }
  )

  ipcMain.handle(
    removePrompt,
    async (event: IpcMainInvokeEvent, { character }: { character: string }) => {
      const list = getPromptList()
      const index = list.findIndex(item => item.character === character)
      if (index !== -1) {
        list.splice(index, 1)
        store.set(StoreKey.List_Prompt, JSON.stringify(list))
        return list
      }
      return false
    }
  )

  ipcMain.handle(getPromptListEvt, async () => {
    return getPromptList()
  })

  ipcMain.handle(
    getPluginPromptEvt,
    async (event: IpcMainInvokeEvent, { plugin }: { plugin: string }) => {
      return getPluginPrompt(plugin)
    }
  )

  ipcMain.handle(
    setPluginPromptEvt,
    async (
      event: IpcMainInvokeEvent,
      { plugin, character }: { plugin: string; character: string }
    ) => {
      return setPluginPrompt({ plugin, character })
    }
  )
}

export function setChat({
  prompt,
  response,
  preset,
}: {
  prompt: string
  response: string
  preset: PresetType
}) {
  const mapStr = store.get(StoreKey.History_Chat) as string | undefined
  if (typeof mapStr !== 'undefined') {
    const chatMap = JSON.parse(mapStr)
    const list = chatMap[preset]
    if (Array.isArray(list)) {
      list.push({
        prompt,
        response,
      })
    }
    store.set(StoreKey.History_Chat, JSON.stringify(chatMap))
  } else {
    const map = {
      [preset]: [
        {
          prompt,
          response,
        },
      ],
    }
    store.set(StoreKey.History_Chat, JSON.stringify(map))
  }
}

export function getChatList(type: PresetType): ChatContent[] {
  const mapStr = store.get(StoreKey.History_Chat) as string | undefined
  if (typeof mapStr !== 'undefined') {
    const chatMap = JSON.parse(mapStr)
    const list = chatMap[type] || []
    return list
  } else {
    return []
  }
}

export function getPromptList(): PromptSet[] {
  const mapStr = store.get(StoreKey.List_Prompt) as string | undefined
  if (typeof mapStr !== 'undefined') {
    const promptList = JSON.parse(mapStr)
    return promptList
  } else {
    return []
  }
}

export function getPromptByCharacter(character: string): string {
  const list = getPromptList()
  const selectedItems = list.filter(item => item.character === character)
  if (selectedItems.length > 0) {
    return selectedItems[0].prompt
  }
  return ''
}

export function setPluginPrompt({
  plugin,
  character,
}: {
  plugin: string
  character: string
}) {
  const mapStr = store.get(StoreKey.Map_Pluginprompt) as string | undefined
  if (typeof mapStr !== 'undefined') {
    const map = JSON.parse(mapStr)
    map[plugin] = character
    store.set(StoreKey.Map_Pluginprompt, JSON.stringify(map))
  } else {
    const map = {
      [plugin]: character,
    }
    store.set(StoreKey.Map_Pluginprompt, JSON.stringify(map))
  }
}

export function getPluginPrompt(plugin: string): PromptSet {
  const mapStr = store.get(StoreKey.Map_Pluginprompt) as string | undefined
  if (typeof mapStr !== 'undefined') {
    const map = JSON.parse(mapStr)
    const character = map[plugin] || ''
    return {
      character,
      prompt: getPromptByCharacter(character),
    }
  }
  return {
    character: '',
    prompt: '',
  }
}
