import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Store from 'electron-store'
import { ChatContent, PromptSet } from '../types'
import { PresetType } from '../../src/@types'
import { StoreKey } from '../../src/app/constants'
const store = new Store()
// const schema = {
// 	foo: {
// 		type: 'number',
// 		maximum: 100,
// 		minimum: 1,
// 		default: 50
// 	},
// 	bar: {
// 		type: 'string',
// 		format: 'url'
// 	}
// };
// const store = new Store({schema});
// console.log(store.get('foo'));
// //=> 50
// store.set('foo', '1');

export function setupStoreHandlers() {
  ipcMain.handle(
    'setStore',
    async (
      event: IpcMainInvokeEvent,
      { key, blob }: { key: string; blob: any }
    ) => {
      store.set(key, blob)
    }
  )

  ipcMain.handle('getStore', async (event: IpcMainInvokeEvent, key: string) => {
    return store.get(key)
  })

  ipcMain.handle(
    'getChatList',
    async (event: IpcMainInvokeEvent, preset: PresetType) => {
      return getChatList(preset)
    }
  )

  ipcMain.handle(
    'removeChat',
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
    'addPrompt',
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
    'editPrompt',
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
    'removePrompt',
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

  ipcMain.handle('getPromptList', async () => {
    return getPromptList()
  })
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
